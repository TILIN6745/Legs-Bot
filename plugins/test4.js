import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    const carpeta = './Sessions'
    const archivo = 'creds.json'
    const ruta = `${carpeta}/${archivo}`

    if (!fs.existsSync(ruta)) {
      return conn.sendMessage(
        m.chat,
        { text: '❌ No se encontró el archivo creds.json en ./Sessions', ...global.rcanal },
        { quoted: m }
      )
    }

    await m.react('⏳')

    // Leer el archivo creds.json en buffer
    const fileBuffer = fs.readFileSync(ruta)

    // Enviar directamente el creds.json
    await conn.sendMessage(
      m.chat,
      {
        document: fileBuffer,
        fileName: archivo,
        mimetype: 'application/json',
        caption: 'Aquí tienes tu creds.json 📂',
        ...global.rcanal
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (err) {
    console.error(err)
    await m.react('❌')
    conn.sendMessage(
      m.chat,
      { text: '❌ Error al enviar el creds.json', ...global.rcanal },
      { quoted: m }
    )
  }
}

handler.help = ['copiacreds']
handler.tags = ['owner']
handler.command = /^copiacreds$/i
handler.rowner = true

export default handler