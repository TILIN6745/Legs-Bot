
//Obtiene el número del bot principal desde ./Sessions/creds.json


import fs from 'fs';

let handler = async (m, { conn }) => { try { // Obtén nombre del usuario let userName = m.pushName || (m.sender ? m.sender.split('@')[0] : 'Usuario');

// Lee el creds.json para obtener el número del bot principal
const credsPath = './Sessions/creds.json';
let rawCreds = fs.readFileSync(credsPath);
let creds = JSON.parse(rawCreds);

// El id del bot suele estar en creds.me.id (ejemplo: "51987654321@s.whatsapp.net")
const botId = creds?.me?.id || '';
const cleanNumber = botId.replace(/[^0-9]/g, '');

// Construye el mensaje de respuesta
const message = `Hola, ${userName} el Bot Ofc es:\n> wa.me/${cleanNumber}`;

// Envía la respuesta
if (typeof m.reply === 'function') {
  return m.reply(message);
}

await conn.sendMessage(m.chat, { text: message }, { quoted: m });

} catch (err) { console.error('ofcbot handler error:', err); } };

// Opciones de comando
handler.command = ['ofcbot'];
handler.tags = ['general'];
handler.help = ['ofcbot'];

export default handler;

