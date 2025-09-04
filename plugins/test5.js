import { totalmem, freemem } from 'os'
import osu from 'node-os-utils'
import { sizeFormatter } from 'human-readable'
import { performance } from 'perf_hooks'

const cpu = osu.cpu
const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  // Latencia real con microsegundos
  let start = performance.now()
  if (conn.sendPresenceUpdate) await conn.sendPresenceUpdate('composing', m.chat)
  let latency = (performance.now() - start).toFixed(4) // Ej: 0.9999 ms

  // Uptime
  let totalMs = process.uptime() * 1000
  let muptime = clockString(totalMs)
  let dias = Math.floor(totalMs / 86400000) // 1 día = 86400000 ms

  // Chats
  let chats = Object.values(conn.chats).filter(chat => chat.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid)

  // Uso de CPU
  let cpuUsage = await cpu.usage()  // porcentaje

  // Hora y fecha actual
  let now = new Date()
  let hora = now.toLocaleTimeString('es-PE', { hour12: false })
  let fecha = now.toLocaleDateString('es-PE')

  let texto = `
⚡ *Estado del Bot*

📡 *Velocidad de Respuesta:*  
→ _${latency} ms_

⏱️ *Tiempo Activo:*  
→ _${dias}d ${muptime}_

💬 *Chats Activos:*  
→ 👤 _${chats.length}_ chats privados  
→ 👥 _${groups.length}_ grupos

🖥️ *Uso de RAM:*  
→ 💾 _${format(totalmem() - freemem())}_ / _${format(totalmem())}_

⚙️ *Uso de CPU:*  
→ _${cpuUsage.toFixed(2)} %_

🕒 *Hora del Bot:* ${hora}  
📅 *Fecha:* ${fecha}
`.trim()

  if (m.react) m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['speed2']
handler.tags = ['info']
handler.command = ['speed2']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}