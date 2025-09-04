import axios from 'axios';
import baileys from '@whiskeysockets/baileys';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args, usedPrefix = '.' }) => {
  if (!text) return m.reply(`💙 Ingresa un anime; ejemplo:\n> ${usedPrefix}anime Doraemon`);

  try {
    if (text.includes("https://")) {
      m.react("🕒");
      let i = await dl(args[0]);
      let isVideo = i.download.includes(".mp4");
      await conn.sendMessage(
        m.chat,
        { [isVideo ? "video" : "image"]: { url: i.download }, caption: i.title, ...rcanal },
        { quoted: fkontak }
      );
      m.react("☑️");
    } else {
      m.react('🕒');
      const results = await pins(text);
      if (!results.length) return conn.sendMessage(m.chat, { text: `No se encontraron resultados para "${text}".`, ...rcanal }, { quoted: m });

      const medias = results.slice(0, 10).map(img => ({ type: 'image', data: { url: img.image_large_url } }));

      await conn.sendSylphy(
        m.chat,
        medias,
        {
          caption: `◜ Anime Search ◞\n\n≡ 🔎 \`Búsqueda :\` "${text}"\n≡ 📄 \`Resultados :\` ${medias.length}`,
          quoted: m,
          ...rcanal
        }
      );

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }, ...rcanal });
    }
  } catch (error) {
    conn.sendMessage(m.chat, { text: `Error al obtener anime:\n${error}`, ...rcanal }, { quoted: m });
  }
};

handler.help = ['anime <anime>'];
handler.command = ['anime'];
handler.tags = ["reacciones"];

export default handler;

/* Función para descarga directa */
async function dl(url) {
  try {
    let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(e => e.response);
    let $ = cheerio.load(res.data);
    let tag = $('script[data-test-id="video-snippet"]');

    if (tag.length) {
      let result = JSON.parse(tag.text());
      return {
        title: result.name,
        download: result.contentUrl
      };
    } else {
      let json = JSON.parse($("script[data-relay-response='true']").eq(0).text());
      let result = json.response.data["v3GetPinQuery"].data;
      return {
        title: result.title,
        download: result.imageLargeUrl
      };
    }
  } catch {
    return { msg: "Error, inténtalo de nuevo más tarde" };
  }
};

/* Función para búsqueda en Pinterest */
const pins = async (judul) => {
  const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22applied_unified_filters%22%3Anull%2C%22appliedProductFilters%22%3A%22---%22%2C%22article%22%3Anull%2C%22auto_correction_disabled%22%3Afalse%2C%22corpus%22%3Anull%2C%22customized_rerank_type%22%3Anull%2C%22domains%22%3Anull%2C%22filters%22%3Anull%2C%22query%22%3A%22${encodeURIComponent(judul)}%22%2C%22redux_normalize_feed%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D`;
  
  const headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'referer': 'https://id.pinterest.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  };

  try {
    const res = await axios.get(link, { headers });
    if (res.data && res.data.resource_response && res.data.resource_response.data && res.data.resource_response.data.results) {
      return res.data.resource_response.data.results.map(item => {
        if (item.images) {
          return {
            image_large_url: item.images.orig?.url || null,
            image_medium_url: item.images['564x']?.url || null,
            image_small_url: item.images['236x']?.url || null
          };
        }
        return null;
      }).filter(img => img !== null);
    }
    return [];
  } catch (error) {
    console.error('Error pins():', error);
    return [];
  }
};