import fs from 'fs';
import path from 'path';
import { yukiJadiBot } from './yukiJadiBot.js'; // Ajusta la ruta

let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) {
        return conn.sendMessage(m.chat, { text: `⚠️ Usa correctamente: ${usedPrefix}coud +573146739176` }, { quoted: m });
    }

    // Normaliza el número: elimina todo lo que no sea dígito
    let rawNumber = args[0];
    let number = rawNumber.replace(/\D/g, '');
    if (!number) return conn.sendMessage(m.chat, { text: `⚠️ Número inválido` }, { quoted: m });

    // Carpeta de la sesión
    let pathYukiJadiBot = path.join(`./${jadi}/`, number);
    if (!fs.existsSync(pathYukiJadiBot)){
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }

    // Llamada al bot
    let sock = await yukiJadiBot({
        pathYukiJadiBot,
        m,
        conn,
        args: [number], // importante pasar el número limpio
        usedPrefix,
        command: 'coud',
        fromCommand: true
    });

    // Cuando se conecte, envía mensaje al chat de origen
    if (sock?.user) {
        let userMention = `@${m.sender.split('@')[0]}`;
        await conn.sendMessage(m.chat, {
            text: `${userMention}, 𝖠𝗁𝗈𝗋𝖺 𝖾𝗋𝖾𝗌 𝗉𝖺𝗋𝗍𝖾 𝖽𝖾 𝗅𝖺 𝖿𝖺𝗆𝗂𝗅𝗂𝖺 *𝗆𝗂𝖼𝗁𝗂𝗌 𝗐𝖺 𝖻𝗈𝗍𝗌* :𝖣`,
            mentions: [m.sender]
        }, { quoted: m });
    }
}

handler.help = ['coud'];
handler.tags = ['serbot'];
handler.command = ['coud'];
export default handler;