import { totalmem, freemem } from 'os'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  // Medir latencia aproximada
  let start = Date.now()
  if (conn.sendPresenceUpdate) await conn.sendPresenceUpdate('composing', m.chat)
  let latency = Date.now() - start

  // Tiempo activo del bot
  let muptime = clockString(process.uptime() * 1000)

  // Chats activos
  let chats = Object.values(conn.chats).filter(chat => chat.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid)

  let texto = `
⚡ *Estado del Bot*

📡 *Velocidad de Respuesta:*  
→ _${latency} ms_

⏱️ *Tiempo Activo:*  
→ _${muptime}_

💬 *Chats Activos:*  
→ 👤 _${chats.length}_ chats privados  
→ 👥 _${groups.length}_ grupos

🖥️ *Uso de RAM:*  
→ 💾 _${format(totalmem() - freemem())}_ / _${format(totalmem())}_
`.trim()

  if (m.react) m.react('✈️') // Reaccionar si tu librería lo soporta
  conn.reply(m.chat, texto, m)
}

handler.help = ['t7']      // Ayuda y referencia
handler.tags = ['info']    // Categoría
handler.command = ['t7']   // Comando que se ejecuta con .t7

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}