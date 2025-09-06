import { readdirSync, statSync, unlinkSync, existsSync, promises as fsPromises } from "fs"
const fs = { ...fsPromises, existsSync }
import path from 'path'
import ws from 'ws'

let handler = async (m, { conn, command, usedPrefix }) => {
  const isCommandDelete = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)
  const isCommandStop = /^(stop|pausarai|pausarbot)$/i.test(command)
  const isCommandList = /^(bots|sockets|socket)$/i.test(command)

  switch (true) {
    // ✦ LISTA DE SUBBOTS ✦
    case isCommandList: {
      const users = [...new Set([...global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]

      function msToTime(ms) {
        let segundos = Math.floor(ms / 1000)
        let minutos = Math.floor(segundos / 60)
        let horas = Math.floor(minutos / 60)
        let dias = Math.floor(horas / 24)
        segundos %= 60
        minutos %= 60
        horas %= 24
        return `${dias ? dias + "d " : ""}${horas ? horas + "h " : ""}${minutos ? minutos + "m " : ""}${segundos ? segundos + "s" : ""}`
      }

      let listado = []
      for (let [i, v] of users.entries()) {
        let jid = v.user.jid.replace(/[^0-9]/g, '')
        let botPath = path.join('./JadiBots', jid)
        let configPath = path.join(botPath, 'config.json')

        // prefijo por defecto
        let prefix = global.prefix ? global.prefix : '.'

        if (fs.existsSync(configPath)) {
          try {
            let config = JSON.parse(await fs.readFile(configPath, 'utf8'))
            prefix = config.prefix || prefix
          } catch (e) {
            prefix = global.prefix || '.'
          }
        }

        listado.push(
`• ✩ 「 ${i + 1} 」
*👤 Usuario:* ${v.user.name || 'Sub-Bot'}
*🧃 Número:* wa.me/${jid}
*⚙️ Prefijo:* ${Array.isArray(prefix) ? prefix.join(', ') : prefix}
*⏱️ Activo:* ${v.uptime ? msToTime(Date.now() - v.uptime) : 'Desconocido'}`
        )
      }

      let replyMessage = listado.length 
        ? listado.join('\n\n') 
        : `❐ No hay Sub-Bots disponibles`

      let responseMessage = `
ꕥ *LISTA DE SUBBOTS ACTIVOS* ꕥ
» *Total:* ${users.length || '0'}

${replyMessage.trim()}
`

      await conn.sendMessage(m.chat, { text: responseMessage, mentions: conn.parseMention(responseMessage), ...global.rcanal }, { quoted: m })
    }
    break
  }
}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler