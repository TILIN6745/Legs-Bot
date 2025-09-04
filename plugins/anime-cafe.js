// =[#] Editado por Ado (github.com/Ado-rgb)

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 
        ? m.mentionedJid[0] 
        : (m.quoted ? m.quoted.sender : m.sender)
    
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `\`${name2}\` está tomando café con \`${name || who}\` ٩(●ᴗ●)۶` 
        : `\`${name2}\` está tomando café ٩(●ᴗ●)۶`

    if (m.isGroup) {
        const videos = [
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852595681.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852590440.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852622256.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852615392.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852609687.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852604742.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852600708.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852648100.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852643540.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852637625.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852632237.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742852626590.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745601869632.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745601874216.mp4',
            'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745601878415.mp4'
        ]
        const video = videos[Math.floor(Math.random() * videos.length)]

        conn.sendMessage(
            m.chat, 
            { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, 
            { quoted: m }
        )
    }
}

handler.help = ['coffee']
handler.tags = ['reacciones']
handler.command = ['coffee', 'cafe', 'café']
handler.group = true

export default handler
