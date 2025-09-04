import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, "🎋 Por favor, ingresa el nombre de la música a descargar.", m)
    }

    let url, videoId, video
    const isUrl = youtubeRegexID.test(text)
    
    if (isUrl) {
      url = text
      videoId = url.match(youtubeRegexID)[1]
      const info = await yts({ videoId })
      video = info?.videos?.[0] || null
      if (!video) return m.reply("✧ No se pudo obtener información del video.")
    } else {
      const search = await yts(text)
      if (!search?.videos?.length) return m.reply("✧ No se encontraron resultados para tu búsqueda.")
      video = search.videos[0]
      url = video.url
    }

    const { title, thumbnail, timestamp, views, ago, author } = video
    const formattedViews = formatViews(views)
    const canal = author?.name || 'Desconocido'

    const infoMessage = 
      `🫟 *<${title || 'Desconocido'}>*\n\n` +
      `> ❄ Canal » *${canal}*\n` +
      `> 🪸 Vistas » *${formattedViews}*\n` +
      `> 🌤 Duración » *${timestamp || 'Desconocido'}*\n` +
      `> 🍰 Publicado » *${ago || 'Desconocido'}*\n` +
      `> 🐛 Link » ${url}`

    
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail || '' },
      caption: infoMessage
    }, { quoted: m })

    const isAudio = ['play', 'yta', 'ytmp3', 'playaudio'].includes(command)
    const isVideo = ['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)

    if (!isAudio && !isVideo) {
      return conn.reply(m.chat, '✧ Comando no reconocido.', m)
    }

    const format = isAudio ? 'audio' : 'video'
    const apiUrl = `https://myapiadonix.vercel.app/download/yt?url=${encodeURIComponent(url)}&format=${format}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.data?.url) {
      throw new Error(json.message || 'No se pudo obtener el enlace de descarga.')
    }

    const downloadUrl = json.data.url

    const contactName = isAudio 
      ? "🌾 𝗬𝗧 𝗔𝗨𝗗𝗜𝗢" 
      : "🐢 𝗬𝗧 𝗩𝗜𝗗𝗘𝗢"

    const fkontak = {
      key: { fromMe: false, participant: "50493732693@s.whatsapp.net" },
      message: {
        contactMessage: { displayName: contactName }
      }
    }

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true
      }, { quoted: fkontak })
    } else if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: '» Descarga completa, aquí tienes tu video.'
      }, { quoted: fkontak })
    }

  } catch (error) {
    console.error('[ERROR YOUTUBE]', error)
    return m.reply(`⚠︎ Ocurrió un error: ${error.message || error}`)
  }
}

handler.command = ['play', 'yta', 'ytmp3', 'playaudio', 'play2', 'ytv', 'ytmp4', 'mp4']
handler.help = ['play', 'play2', 'ytmp3', 'ytmp4']
handler.tags = ['downloader']

export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
