import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn }) => {
  try {
    // Datos del bot y usuario
    let nombreBot = global.namebot || 'Bot'
    let nombreUsuario = await conn.getName(m.sender)
    let bannerFinal = 'https://iili.io/KCX22B1.jpg'

    // Tiempo activo
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    // Fecha actual
    let fecha = new Date().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })

    let menu = `
╭━━━〔 *📋 MENÚ COMPLETO* 〕━━━⬣
┃👋 🌅 Buenos días, *${nombreUsuario}*
┃🤖 Bot: *${nombreBot}*
┃⏱️ Tiempo activo: ${uptime}
┃📅 Fecha: ${fecha}
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *info* 〕━━━⬣
┃➺ .menu
┃➺ .menu2
┃➺ .menu3
┃➺ .menu4
┃➺ .menuff
┃➺ .menuventas
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *🎵 MÚSICA* 〕━━━⬣
┃➺ .play <canción>
┃➺ .play2 <video>
┃➺ .ytmp4 <link>
┃➺ .spotify <link>
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *📥 DESCARGAS* 〕━━━⬣
┃➺ .tiktok <link>
┃➺ .facebook <link>
┃➺ .instagram <link>
┃➺ .twitter <link>
┃➺ .mediafire <link>
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *🎮 JUEGOS* 〕━━━⬣
┃➺ .ppt
┃➺ .adivinanza
┃➺ .slot
┃➺ .trivia
┃➺ .rps
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *⚔️ FREE FIRE* 〕━━━⬣
┃➺ .4vs4
┃➺ .6vs6
┃➺ .8vs8
┃➺ .12vs12 
┃➺ .24vs24
┃➺ .20vs20
┃➺ .guerradeclanes
┃➺ .interno4
┃➺ .kalahari
┃➺ .nexterra
┃➺ .pvp / .cancelarsala
┃➺ .reglaslideres
┃➺ .reglaslideres2
┃➺ .ffstalk / .ffplayer
┃➺ .alpes
┃➺ .purgatorio
┃➺ .bermuda
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *🎨 LOGOS / TEXTOS* 〕━━━⬣
┃➺ .qc (texto)
┃➺ .
┃➺ .
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *🤖 IA / CHAT GPT* 〕━━━⬣
┃➺ .
┃➺ .
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *Grupo* 〕━━━⬣
┃➺ .grupo abrir 
┃➺ .grupo cerrar 
┃➺ .daradmin @etiqueta
┃➺ .quitaradmin @etiqueta
┃➺ .mute @etiqueta
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 *dueño* 〕━━━⬣
┃➺ .
┃➺ .
╰━━━━━━━━━━━━━━━━⬣

> ${nombreBot}
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: menu
    }, { quoted: m })

  } catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Ocurrió un error al mostrar el menú.', m)
  }
}

handler.command = ['m', 'menu', 'help', 'ayuda']
handler.register = false
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
