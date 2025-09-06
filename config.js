import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['5219223728668', 'Ado', true],
  ['5219223728668'],
  ['5219223728668'],
  ['5218336105471'],
]

global.mods = []
global.prems = []

global.namebot = 'LEGS BOT'
global.packname = 'LEGS BOT'
global.author = '𝖡𝖸 Tilin | © 2025'
global.moneda = 'LEGSS 🥷'



global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.sessions = 'LEGSBOS'
global.jadi = 'JadiBots'
global.yukiJadibts = true

global.namecanal = '❇️'
global.idcanal = '120363357544459855@newsletter'
global.idcanal2 = '120363357544459855@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VauK3kA4SpkPQyez1z00'
global.canalreg = '120363357544459855@newsletter'

global.ch = {
  ch1: '120363357544459855@newsletter'
}

global.multiplier = 69
global.maxwarn = 2

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("🔄 Se actualizó 'config.js'"))
  import(`file://${file}?update=${Date.now()}`)
})
