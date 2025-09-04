//[##] Creado por GianPoolS
//[##] No quites los créditos

import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt')
    const body = await res.text()
    const randomkpop = body.split('\n').filter(v => v && v.startsWith('http'))
    const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]

    // Frases dinámicas
    const frases = [
      "✨ Disfruta de BlackPink en acción 💖",
      "🌸 Una imagen más de BlackPink 💟",
      "🔥 BlackPink nunca decepciona 🤩",
      "💌 BlackPink siempre brilla 🌟",
      "🎶 BlackPink en tu área 💎",
      "💞 Un regalo visual de BlackPink 🌷"
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    // Lista de estilos de botones
    const estilos = [
      "💕 SIGUIENTE 💕",
      "💞 SIGUIENTE 💞",
      "🩷 SIGUIENTE 🩷",
      "💌 SIGUIENTE 💌",
      "🧡 SIGUIENTE 🧡",
      "❤️ SIGUIENTE ❤️",
      "💛 SIGUIENTE 💛",
      "💚 SIGUIENTE 💚",
      "🩵 SIGUIENTE 🩵",
      "💙 SIGUIENTE 💙",
      "💜 SIGUIENTE 💜",
      "🤍 SIGUIENTE 🤍",
      "❤️‍🔥 SIGUIENTE ❤️‍🔥",
      "❣️ SIGUIENTE ❣️",
      "💓 SIGUIENTE 💓",
      "💗 SIGUIENTE 💗",
      "💝 SIGUIENTE 💝",
      "💖 SIGUIENTE 💖"
    ]
    const estilo = estilos[Math.floor(Math.random() * estilos.length)]

    conn.sendMessage(m.chat, { react: { text: '🤩', key: m.key } })
    await conn.sendButton(
      m.chat,
      frase,
      namebot, // tu watermark o nombre del bot
      randomkpopx,
      [[estilo, `/${command}`]], // Botón dinámico
      m
    )
  } catch (e) {
    m.reply('❌ Hubo un error al cargar la imagen.')
    console.error(e)
  }
}

handler.help = ['blackpink']
handler.tags = ['']
handler.command = ['blackpink','bp']

export default handler