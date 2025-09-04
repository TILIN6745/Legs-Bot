import axios from 'axios';
import baileys from '@whiskeysockets/baileys';
import cheerio from 'cheerio';

let handler = async (m, { conn, text = '', args = [], usedPrefix = '.' }) => {
  try {
    if (!text || !text.trim()) return m.reply(`💙 Ingresa un anime; ejemplo:\n> ${usedPrefix}anime Doraemon`);

    // Si el texto contiene una URL, tomar la primera palabra como URL (más seguro que args[0] a secas)
    if (/https?:\/\//i.test(text)) {
      m.react("🕒");
      const url = (args && args.length) ? args[0] : text.trim().split(/\s+/)[0];
      let i = await dl(url);
      // asegurarnos que download existe
      if (!i || !i.download) throw new Error('No se encontró el recurso descargable en la URL proporcionada.');
      let isVideo = i.download.includes(".mp4");
      await conn.sendMessage(
        m.chat,
        { [isVideo ? "video" : "image"]: { url: i.download }, caption: i.title || '', ...rcanal },
        { quoted: fkontak }
      );
      m.react("☑️");
    } else {
      m.react('🕒');
      const results = await pins(text);
      if (!results.length) return conn.sendMessage(m.chat, { text: `No se encontraron resultados para "${text}".`, ...rcanal }, { quoted: m });

      const medias = results.slice(0, 10).map(img => ({ type: 'image', data: { url: img.image_large_url } }));

      // sendSylphy es algo custom en tu bot — lo dejé como estaba
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
    console.error('anime handler error:', error);
    await conn.sendMessage(
      m.chat,
      { text: `Error al obtener anime:\n${formatExactError(error)}`, ...rcanal },
      { quoted: m }
    );
  }
};

handler.help = ['anime <anime>'];
handler.command = ['anime']; 
handler.tags = ["reacciones"];

export default handler;

/* 🖼️ Funciones (idénticas / corregidas) */
async function dl(url) {
  try {
    let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    let $ = cheerio.load(res.data);
    let tag = $('script[data-test-id="video-snippet"]');

    if (tag.length) {
      let result = JSON.parse(tag.text());
      return {
        title: result.name || '',
        download: result.contentUrl || ''
      };
    } else {
      let script = $("script[data-relay-response='true']").eq(0).text();
      if (!script) throw new Error('Estructura de Pinterest inesperada (no se encontró data-relay-response).');
      let json = JSON.parse(script);
      let result = json.response?.data?.["v3GetPinQuery"]?.data;
      if (!result) throw new Error('No se pudo parsear el pin (v3GetPinQuery faltante).');
      return {
        title: result.title || '',
        download: result.imageLargeUrl || ''
      };
    }
  } catch (e) {
    // relanzar para que el catch principal lo capture y muestre el error exacto
    throw new Error(`dl(): ${e.message || String(e)}`);
  }
};

const pins = async (judul) => {
  const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(judul)}%22%2C%22redux_normalize_feed%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D`;
  
  const headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'referer': 'https://id.pinterest.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    // otros headers opcionales...
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
    // devolvemos array vacío para que el handler muestre "No se encontraron resultados..." si aplica
    return [];
  }
};

/* 🧩 Utilidad para mostrar el error exacto */
function formatExactError(err) {
  try {
    if (!err) return 'Error desconocido';
    if (typeof err === 'string') return err;
    if (err.response) {
      const code = err.response.status;
      const status = err.response.statusText || '';
      const data = (typeof err.response.data === 'string') ? err.response.data : JSON.stringify(err.response.data);
      return `HTTP ${code} ${status} - ${data}`;
    }
    if (err.request) return 'No se recibió respuesta del servidor';
    if (err.message) return err.message;
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}