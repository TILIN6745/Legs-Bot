import { totalmem, freemem, cpus } from 'os'
import osu from 'node-os-utils'
import { sizeFormatter } from 'human-readable'

const cpu = osu.cpu
const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

var handler = async (m, { conn }) => {
  // Latencia aproximada
  let start = Date.now()
  if (conn.sendPresenceUpdate) await conn.sendPresenceUpdate('composing', m.chat)
  let latency = Date.now() - start

  // Uptime
  let muptime = clockString(process.uptime() * 1000)

  // Chats
  let chats = Object.values(conn.chats).filter(chat => chat.isChats)
  let groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid)

  // Uso de CPU
  let cpuUsage = await cpu.usage()  // porcentaje

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

🖥️ *Uso de CPU:*  
→ 🔥 _${cpuUsage.toFixed(2)} %_
`.trim()

  if (m.react) m.react('✈️')
  conn.reply(m.chat, texto, m)
}

handler.help = ['t7']
handler.tags = ['info']
handler.command = ['t7']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}