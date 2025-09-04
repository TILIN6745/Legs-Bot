import fs from 'fs';
import path from 'path';
import { yukiJadiBot } from './yukiJadiBot.js'; // Ajusta la ruta si es necesario

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`⚠️ Usa correctamente: ${usedPrefix}coud +573146739176`);
    }

    // Normaliza el número: elimina todo lo que no sea dígito
    let who = args[0].replace(/\D/g, '');
    if (!who) return m.reply(`⚠️ Número inválido, usa: ${usedPrefix}coud +573146739176`);

    // Carpeta de la sesión del bot
    let pathYukiJadiBot = path.join(`./${jadi}/`, who);
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }

    // Llama a tu función principal para generar el code
    await yukiJadiBot({
        pathYukiJadiBot,
        m,
        conn,
        args,
        usedPrefix,
        command: 'coud',
        fromCommand: true
    });

    m.reply(`✅ La sesión para +${who} se está creando y guardando en: ./\${jadi}/${who}/`);
}

handler.help = ['coud'];
handler.tags = ['serbot'];
handler.command = ['coud'];

export default handler;