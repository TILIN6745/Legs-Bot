// --[#] Creado por Ado < github.com/Ado-rgb >
import axios from "axios";
import cheerio from "cheerio";
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

const headers = {
  'accept': 'application/json, text/javascript, /, q=0.01',
  'referer': 'https://www.pinterest.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'x-app-version': 'a9522f',
  'x-pinterest-appstate': 'active',
  'x-pinterest-pws-handler': 'www/[username]/[slug].js',
  'x-requested-with': 'XMLHttpRequest'
};

async function obtenerCookies() {
  try {
    const respuesta = await axios.get(base);
    const setHeaders = respuesta.headers['set-cookie'];
    if (setHeaders) return setHeaders.map(c => c.split(';')[0].trim()).join('; ');
    return null;
  } catch {
    return null;
  }
}

async function buscarPinterest(query) {
  if (!query) return { status: false, message: "⚠️ Ingresa un término de búsqueda válido" };
  try {
    const cookies = await obtenerCookies();
    if (!cookies) return { status: false, message: "❌ No se pudieron obtener las cookies" };

    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: { isPrefetch: false, query, scope: "pins", bookmarks: [""], page_size: 10 },
        context: {}
      }),
      _: Date.now()
    };

    const { data } = await axios.get(`${base}${search}`, { headers: { ...headers, 'cookie': cookies }, params });
    const resultados = data.resource_response.data.results.filter(v => v.images?.orig);
    if (resultados.length === 0) return { status: false, message: `⚠️ No se encontraron resultados para: ${query}` };

    return {
      status: true,
      pins: resultados.map(pin => ({
        id: pin.id,
        title: pin.title || "Sin título",
        description: pin.description || "Sin descripción",
        pin_url: `https://pinterest.com/pin/${pin.id}`,
        image: pin.images.orig.url,
        uploader: {
          username: pin.pinner.username,
          full_name: pin.pinner.full_name,
          profile_url: `https://pinterest.com/${pin.pinner.username}`
        }
      }))
    };

  } catch {
    return { status: false, message: "❌ Ocurrió un error al buscar" };
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🐦‍🔥 Ejemplo: ${usedPrefix + command} gatito`);

  await m.reply('🪸 Cargando resultados...');

  async function crearImagen(url) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer });
    return imageMessage;
  }

  function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let resultado = await buscarPinterest(text);
  if (!resultado.status) return m.reply(`⚠️ ${resultado.message}`);

  let pins = resultado.pins.slice(0, 10);
  mezclarArray(pins);

  let tarjetas = [];
  let i = 1;
  for (let pin of pins) {
    let imageUrl = pin.image;
    tarjetas.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `✧ *Título:* ${pin.title}\n » *Descripción:* ${pin.description}\n› *Autor:* ${pin.uploader.full_name} (@${pin.uploader.username})\n✦ *Link:* ${pin.pin_url}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: '' }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `> 💚 Imagen ${i++}`,
        hasMediaAttachment: true,
        imageMessage: await crearImagen(imageUrl)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          { "name": "cta_url", "buttonParamsJson": `{"display_text":"🦖 𝗩𝗲𝗿 𝗲𝗻 𝗽𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁","url":"${pin.pin_url}"}` }
        ]
      })
    });
  }

  const botMensaje = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({ text: "> 🥞 Búsqueda completada" }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: [...tarjetas] })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, botMensaje.message, { messageId: botMensaje.key.id });
};

handler.help = ['pinterest'];
handler.tags = ['search'];
handler.command = /^(pinterest)$/i;

export default handler;
