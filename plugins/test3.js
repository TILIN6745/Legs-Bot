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

// Las funciones dl() y pins() quedan tal cual de tu .pin