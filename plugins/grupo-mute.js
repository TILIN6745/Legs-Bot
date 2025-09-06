const defaultImage = 'https://files.catbox.moe/ubftco.jpg'

async function isAdminOrOwner(m, conn) {
    try {
        const groupMetadata = await conn.groupMetadata(m.chat)
        const participant = groupMetadata.participants.find(p => p.id === m.sender)
        return participant?.admin || m.fromMe
    } catch {
        return false
    }
}

const handler = async (m, { conn, command, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('❐ ✩ Solo funciona en grupos ❐')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]

    if (!chat.mutedUsers) chat.mutedUsers = {}

    const mentioned = m.mentionedJid ? m.mentionedJid[0] : args[0]
    if (!mentioned) return m.reply('❐ ✩ Menciona al usuario a mutear/desmutear ❐')

    if (!isAdmin) return m.reply('❐ ✩ Solo admins pueden mutear/desmutear usuarios ❐')

    if (command === 'mute') {
        chat.mutedUsers[mentioned] = true
        return m.reply(`❐ ✩ Usuario muteado correctamente ✧\n✐ Muted por: @${m.sender.split`@`[0]} ❐`)
    }

    if (command === 'unmute') {
        delete chat.mutedUsers[mentioned]
        return m.reply(`❐ ✩ Usuario desmuteado correctamente ✧\n✐ Desmuted por: @${m.sender.split`@`[0]} ❐`)
    }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = false
handler.tags = ['group']
handler.help = ['mute', 'unmute']

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return
    const chat = global.db.data.chats[m.chat]
    if (!chat || !chat.mutedUsers) return

    const senderId = m.key.participant || m.sender
    if (chat.mutedUsers[senderId]) {
        try {
            await conn.sendMessage(m.chat, {
                delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: senderId }
            })
        } catch {
            const userTag = `@${senderId.split('@')[0]}`
            await conn.sendMessage(m.chat, {
                text: `✩ No pude eliminar el mensaje de ${userTag} ✧\n✐ Puede que me falten permisos ❐`,
                mentions: [senderId]
            })
        }
        return true
    }
}

export default handler