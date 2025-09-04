const defaultImage = 'https://files.catbox.moe/ubftco.jpg'

let handler = async (m, { conn, args, text }) => {
  let event = args[0]
  if (!event) return m.reply(`❌ Error: debes especificar un evento\nEjemplo: *.dar bienvenida @usuario*`)

  let who = m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : [m.sender]
  let act = false

  switch (event.toLowerCase()) {
    case 'add':
    case 'bienvenida':
    case 'invite':
    case 'welcome':
      act = 'add'
      break
    case 'bye':
    case 'despedida':
    case 'leave':
    case 'remove':
      act = 'remove'
      break
    default:
      return m.reply('⚠️ Evento no válido. Usa: bienvenida / bye')
  }

  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupSize = groupMetadata.participants.length
  const userId = who[0]
  const userMention = `@${userId.split('@')[0]}`
  let profilePic

  try {
    profilePic = await conn.profilePictureUrl(userId, 'image')
  } catch {
    profilePic = defaultImage
  }

  const isLeaving = act === 'remove'
  const externalAdReply = {
    forwardingScore: 999,
    isForwarded: true,
    title: `${isLeaving ? '🍿 Adiós' : '🌟 Bienvenido'}`,
    body: `👥 Miembros actuales: ${groupSize}`,
    mediaType: 1,
    renderLargerThumbnail: true,
    thumbnailUrl: profilePic,
    sourceUrl: `https://wa.me/${userId.split('@')[0]}`
  }

  if (!isLeaving) {
    const bienvenida = `
🧃ㅤHola ${userMention}  

🌿 Bienvenid@ a *${groupMetadata.subject}*  
👥 Ahora somos *${groupSize}* personas en el grupo.  
📌 Respeta las reglas para que la pasemos chido ✨  
`.trim()

    await conn.sendMessage(m.chat, { text: bienvenida, contextInfo: { mentionedJid: [userId], externalAdReply } })
  } else {
    const despedida = `
🥀ㅤ${userMention} salió de *${groupMetadata.subject}*  

👥 Quedamos *${groupSize}* miembros.  
🙏 Gracias por estar aquí, vuelve cuando quieras 🌸  
`.trim()

    await conn.sendMessage(m.chat, { text: despedida, contextInfo: { mentionedJid: [userId], externalAdReply } })
  }
}

handler.help = ['dar *<bienvenida/despedida> @usuario*']
handler.tags = ['grupo']
handler.command = ['dar', 'darme']
handler.admin = true
handler.group = true

export default handler