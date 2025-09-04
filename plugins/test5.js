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

  // Chats
  let chats = Object.values(conn.chats).filter(chat => chat.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid)

  // Uso de CPU
  let cpuUsage = await cpu.usage()  // porcentaje

  // Hora y fecha actual en formato visual
  let now = new Date()
  let hora = now.toLocaleTimeString('es-PE', { hour12: true }) // 12h con a.m / p.m
  let fecha = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })

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

⚙️ *Uso de CPU:*  
→ _${cpuUsage.toFixed(2)} %_

📊 Fecha y Hora
→ ${hora}
→ ${fecha}
`.trim()

  if (m.react) m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['speed2']
handler.tags = ['info']
handler.command = ['speed2']

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '--d --h --m --s'
  let d = Math.floor(ms / 86400000) // días
  let h = Math.floor((ms % 86400000) / 3600000) // horas
  let m = Math.floor((ms % 3600000) / 60000) // minutos
  let s = Math.floor((ms % 60000) / 1000) // segundos
  return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
}