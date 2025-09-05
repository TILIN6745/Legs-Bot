import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    const creds = JSON.parse(fs.readFileSync('./session/creds.json'))

    // Tomar solo la parte antes de ":" o "@"
    let botIdRaw = creds?.me?.id || ''
    let botNumber = String(botIdRaw).split(/[:@]/)[0] // 👉 queda solo el número base
    botNumber = botNumber.replace(/[^0-9]/g, '')      // limpiar cualquier cosa rara

    if (!botNumber) {
      return m.reply('❌ No se pudo obtener el número del bot.')
    }

    await conn.sendMessage(m.chat, {
      text: `Hola, Fog el Bot Ofc es:\n> wa.me/${botNumber}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: '❌ Error al leer el número del bot.' }, { quoted: m })
  }
}

handler.help = ['ofcbot']
handler.tags = ['info']
handler.command = /^ofcbot$/i

export default handler