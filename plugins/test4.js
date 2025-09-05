import fs from 'fs';

let handler = async (m, { conn }) => {
  try {
    let userName = m.pushName || (m.sender ? m.sender.split('@')[0] : 'Usuario');

    // Ruta del creds.json
    const credsPath = './Sessions/creds.json';
    let rawCreds = fs.readFileSync(credsPath);
    let creds = JSON.parse(rawCreds);

    // Busca en diferentes lugares
    let botId =
      creds?.me?.id ||
      creds?.creds?.me?.id ||
      creds?.registered?.id ||
      '';

    const cleanNumber = botId.replace(/[^0-9]/g, '') || '000000000';

    const message = `Hola, ${userName} el Bot Ofc es:\n> wa.me/${cleanNumber}`;

    if (typeof m.reply === 'function') {
      return m.reply(message);
    }

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (err) {
    console.error('ofcbot handler error:', err);
  }
};

handler.command = ['ofcbot'];
handler.customPrefix = /^\\.?ofcbot$/i;
handler.tags = ['general'];
handler.help = ['ofcbot'];

export default handler;