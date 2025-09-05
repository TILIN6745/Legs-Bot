import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    // Nombre del usuario que escribe
    let userName = m.pushName || (m.sender ? m.sender.split('@')[0] : 'Usuario')

    // Ruta del creds.json
    const credsPath = './Sessions/creds.json'

    if (!fs.existsSync(credsPath)) {
      return m.reply('❌ No se encontró el archivo creds.json en ./Sessions/')
    }

    // Leer creds.json
    let rawCreds = fs.readFileSync(credsPath)
    let creds = JSON.parse(rawCreds)

    // Extraer el número limpio
    let botId = creds?.me?.id || ''
    let cleanNumber = botId.replace(/[^0-9]/g, '')

    // Mensaje final
    const message = `Hola, ${userName} el Bot Ofc es:\n> wa.me/${cleanNumber}`

    await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  } catch (err) {
    console.error('ofcbot handler error:', err)
    m.reply('❌ Error al leer el creds.json')
  }
}

handler.command = ['ofcbot']
handler.tags = ['general']
handler.help = ['ofcbot']

export default handler