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
            let plugin = await import(path.resolve(pluginsPath, file));
            if (plugin.default) {
                let cmd = plugin.default.command || [];
                if (!Array.isArray(cmd)) cmd = [cmd];
                let help = plugin.default.help || [];
                if (!Array.isArray(help)) help = [help];
                let code = fs.readFileSync(path.resolve(pluginsPath, file), 'utf-8');
                commandsInfo.push({ file, commands: cmd, help, code });
            }
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

        if (!match) {
            let testMsg = { chat: '+50494547493', body: `${usedPrefix}${query}`, fromMe: false };
            try {
                let mainHandler = await import(path.resolve('./handler.js'));
                await mainHandler.default(testMsg, { conn, text: query, usedPrefix });
            } catch (err) {
                await conn.sendMessage(
                    '+50494547493',
                    { text: `/sug amo el comando ${query} \nError: ${err.message}`, ...global.rcanal }
                );
                await conn.sendMessage(
                    m.chat,
                    { text: `❌ Hubo un error ejecutando el comando '${query}'. Se envió el reporte automático a tu número privado.`, ...global.rcanal },
                    { quoted: m }
                );
            }
        }

        await m.react('🔥');
    } catch (e) {
        await m.react('❎');
        m.reply('❌ Ocurrió un error analizando los plugins.');
    }
};

handler.help = ["michi"];
handler.tags = ["ia"];
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
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    });

    return response.data;
}
