import fs from 'fs';
import path from 'path';
import { yukiJadiBot } from './yukiJadiBot.js'; // Ajusta la ruta
import * as ws from 'ws';

let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.sendMessage(m.chat, { text: `⚠️ Usa correctamente: ${usedPrefix}coud +573146739176` }, { quoted: m });

    // Normaliza el número
    let number = args[0].replace(/\D/g, '');
    if (!number) return conn.sendMessage(m.chat, { text: '⚠️ Número inválido' }, { quoted: m });

    // Carpeta de sesión
    let pathYukiJadiBot = path.join(`./${jadi}/`, number);
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true });

    // Llama a yukiJadiBot
    let sock = await yukiJadiBot({
        pathYukiJadiBot,
        m,
        conn,
        args: [number],
        usedPrefix,
        command: 'coud',
        fromCommand: true
    });

    // Solicita el pairing code
    try {
        let secret = await sock.requestPairingCode(number);
        secret = secret.match(/.{1,4}/g)?.join(''); // Formatea en bloques de 4 dígitos

        await conn.sendMessage(m.chat, {
            text: `@${m.sender.split('@')[0]}, tu código de 8 dígitos es: ${secret}`,
            mentions: [m.sender]
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        conn.sendMessage(m.chat, { text: `⚠️ No se pudo generar el code. Intenta de nuevo.` }, { quoted: m });
    }
}

handler.help = ['coud'];
handler.tags = ['serbot'];
handler.command = ['coud'];
export default handler;