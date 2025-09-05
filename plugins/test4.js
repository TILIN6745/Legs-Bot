const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!/image|video/.test(mime)) {
    return conn.sendMessage(
      m.chat,
      { text: `✿ Responde a una *imagen o video* para reenviarlo\n`, ...global.rcanal },
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

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['ver']

export default handler