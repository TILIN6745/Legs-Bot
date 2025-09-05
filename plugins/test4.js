const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  const fileName = (q.msg || q).fileName || `archivo.${mime.split('/')[1] || 'bin'}`

  if (!mime) {
    return conn.sendMessage(
      m.chat,
      { text: `✿ Responde a un *archivo, imagen, video o audio* para reenviarlo\n`, ...global.rcanal },
      { quoted: m }
    )
  }

  await m.react('🕒')

  try {
    const media = await q.download()
    if (!media) throw new Error('No se pudo descargar la media')

    if (/image/.test(mime)) {
      await conn.sendMessage(
        m.chat,
        { image: media, caption: `📷 Aquí está tu imagen`, ...global.rcanal },
        { quoted: m }
      )
    } else if (/video/.test(mime)) {
      await conn.sendMessage(
        m.chat,
        { video: media, caption: `🎥 Aquí está tu video`, ...global.rcanal },
        { quoted: m }
      )
    } else if (/audio/.test(mime)) {
      await conn.sendMessage(
        m.chat,
        { audio: media, mimetype: mime, fileName, ptt: false, ...global.rcanal },
        { quoted: m }
      )
    } else {
      // Documentos: pdf, docx, xls, zip, rar, etc. con su nombre original
      await conn.sendMessage(
        m.chat,
        { document: media, mimetype: mime, fileName, ...global.rcanal },
        { quoted: m }
      )
    }

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(
      m.chat,
      { text: '╭─❀ *Error de Envío* ❀─╮\n✘ No se pudo enviar la media\n╰───────────────────────────╯', ...global.rcanal },
      { quoted: m }
    )
  }
}

handler.help = ['ver2']
handler.tags = ['tools']
handler.command = ['ver2']

export default handler