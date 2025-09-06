import path from 'path'
let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, text }) {
  if (!text) return conn.reply(m.chat, `✩ ¿Qué ranking quieres ver?\n\nEjemplo: *${command} usuarios más activos*`, m)

  let ps = groupMetadata.participants.map(v => v.id)
  let [a, b, c, d, e, f, g, h, i, j] = Array.from({ length: 10 }, () => ps.getRandom())

  let intro = pickRandom([
    `> ✧ *Top 10 de ${text.toUpperCase()}*`,
    `> ✩ *Ranking oficial de ${text}*`,
    `> ✐ *Los más destacados en ${text}*`
  ])

  let top = 
`${intro}

❐ ${user(a)}
✩ ${user(b)}
✧ ${user(c)}
ꕥ ${user(d)}
✐ ${user(e)}
❐ ${user(f)}
✩ ${user(g)}
✧ ${user(h)}
ꕥ ${user(i)}
✐ ${user(j)}`

  conn.reply(m.chat, top, m, { mentions: [a, b, c, d, e, f, g, h, i, j] })
}

handler.help = ['top']
handler.command = ['top']
handler.tags = ['group']
handler.group = true
handler.register = false

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}