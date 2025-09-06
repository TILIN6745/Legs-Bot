import { createHash } from 'crypto' 
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false
  let isEnable = chat[type] || false

  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false
  } else {
    const estado = isEnable ? '✓ Activado' : '✗ Desactivado'
    return conn.reply(m.chat, `✦ Solo un administrador puede activar o desactivar el comando.`, m)
  }

  switch (type) {
    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
  }

  chat[type] = isEnable

  conn.reply(m.chat, `❐ *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : 'para este chat'}`, m)
}

handler.help = ['detect', 'avisos']
handler.tags = ['group']
handler.command = ['detect', 'avisos']

export default handler