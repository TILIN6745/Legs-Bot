import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode';
import NodeCache from 'node-cache';
import { useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, makeWASocket } from '@whiskeysockets/baileys';
import pino from 'pino';
import chalk from 'chalk';

// Carpeta raíz de sesiones (ajusta según tu proyecto)
const jadi = 'sessions';

// Función principal de jd.js para .coud
export async function yukiJadiBot({ conn, m, args, usedPrefix }) {
    if (!args[0]) return conn.sendMessage(m.chat, { text: `⚠️ Usa correctamente: ${usedPrefix}coud +573146739176` }, { quoted: m });

    // Normaliza el número: elimina todo lo que no sea dígito
    let number = args[0].replace(/\D/g, '');
    if (!number) return conn.sendMessage(m.chat, { text: `⚠️ Número inválido` }, { quoted: m });

    // Carpeta de sesión
    const pathYukiJadiBot = path.join(`./${jadi}/`, number);
    if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true });

    // Inicializa estado de autenticación
    const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

    // Obtiene la versión más reciente de Baileys
    const { version } = await fetchLatestBaileysVersion();

    // Opciones de conexión
    const sock = makeWASocket({
        logger: pino({ level: 'fatal' }),
        printQRInTerminal: false,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
        browser: ['Michi Wa [ Prem Bot ]','Chrome','2.0.0'],
        version: version
    });

    // Evento de actualización de conexión
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Si llega el QR (para pairing code)
        if (qr) {
            try {
                // Genera el code de 8 dígitos
                let secret = await sock.requestPairingCode(number);
                secret = secret.match(/.{1,4}/g)?.join('');

                // Envía el code al chat de origen
                await conn.sendMessage(m.chat, {
                    text: `@${m.sender.split('@')[0]}, tu código de 8 dígitos es: ${secret}`,
                    mentions: [m.sender]
                }, { quoted: m });

                console.log(chalk.greenBright(`[Coud] Code para +${number}: ${secret}`));
            } catch (err) {
                console.error(err);
                await conn.sendMessage(m.chat, { text: `⚠️ No se pudo generar el code. Intenta de nuevo.` }, { quoted: m });
            }
        }

        // Conexión abierta
        if (connection === 'open') {
            await conn.sendMessage(m.chat, {
                text: `@${m.sender.split('@')[0]}, 𝖠𝗁𝗈𝗋𝖺 𝖾𝗋𝖾𝗌 𝗉𝖺𝗋𝗍𝖾 𝖽𝖾 𝗅𝖺 𝖿𝖺𝗆𝗂𝗅𝗂𝖺 *𝗆𝗂𝖼𝗁𝗂𝗌 𝗐𝖺 𝖻𝗈𝗍𝗌* :𝖣`,
                mentions: [m.sender]
            }, { quoted: m });
            console.log(chalk.cyanBright(`[Coud] Sesión +${number} conectada.`));
        }

        // Conexión cerrada
        if (connection === 'close') {
            let reason = lastDisconnect?.error?.output?.statusCode;
            console.log(chalk.yellow(`[Coud] Sesión +${number} desconectada. Razón: ${reason}`));
        }
    });

    // Guardar credenciales automáticamente
    sock.ev.on('creds.update', saveCreds);

    return sock; // Retorna el socket para uso posterior si se necesita
}