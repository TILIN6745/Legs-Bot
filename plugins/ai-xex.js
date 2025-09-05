import fs from "fs";
import path from "path";
import axios from "axios";

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply('❌ Escribí un comando o pregunta sobre un comando.');
    await m.react('💬');

    try {
        const pluginsPath = path.join('./plugins');
        const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
        let commandsInfo = [];

        for (let file of files) {
            let filePath = path.join(pluginsPath, file);
            let code = fs.readFileSync(filePath, 'utf-8');

            let cmdMatch = code.match(/handler\.command\s*=\s*(.*)/);
            let helpMatch = code.match(/handler\.help\s*=\s*(.*)/);

            let cmd = cmdMatch ? eval(cmdMatch[1]) : [];
            if (!Array.isArray(cmd)) cmd = [cmd];
            let help = helpMatch ? eval(helpMatch[1]) : [];
            if (!Array.isArray(help)) help = [help];

            commandsInfo.push({ file, commands: cmd, help, code });
        }

        let query = text.trim().toLowerCase();
        let match = commandsInfo.find(c => c.commands.some(cmd => cmd.toLowerCase() === query));

        let promptIA = '';
        if (match) {
            promptIA = `Analiza este comando de un bot de WhatsApp y explica detalladamente cómo funciona, qué hace y cómo usarlo, incluyendo ejemplos si es posible:\n\n${match.code}`;
        } else {
            promptIA = `Un usuario preguntó por un comando llamado '${query}' que no se encuentra en los plugins. Explica cómo debería funcionar basándote en lo común de un bot de WhatsApp, qué argumentos podría recibir y ejemplos de uso.`;
        }

        let respuestaIA = await openai(promptIA);

        await conn.sendMessage(
            m.chat,
            { text: `\`🌴 Michi Asistente\`\n\n> ${respuestaIA}`, ...global.rcanal },
            { quoted: m }
        );

        await m.react('🔥');

    } catch (e) {
        await m.react('❎');
        m.reply(`❌ Ocurrió un error analizando los plugins: ${e.message}`);
    }
};

handler.help = ["michi <comando>"];
handler.tags = ["asistente"];
handler.command = /^(michi)$/i;
handler.register = false;

export default handler;

async function openai(prompt) {
    let response = await axios.post("https://chateverywhere.app/api/chat/", {
        model: { id: "gpt-4", name: "GPT-4", maxLength: 32000, tokenLimit: 8000, completionTokenLimit: 5000 },
        messages: [{ pluginId: null, content: prompt, role: "user" }],
        prompt,
        temperature: 0.5
    }, {
        headers: {
            "Accept": "/*/",
            "User-Agent": "Mozilla/5.0"
        }
    });
    return response.data;
}
