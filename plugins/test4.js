// Handler para .coud
let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Detecta número con código de país
    let who = args[0] && /^\+?\d{6,15}$/.test(args[0]) ? args[0] : m.sender;
    
    // Normaliza el número para usarlo en carpeta
    let id = who.replace(/\D/g,'');
    let pathYukiJadiBot = path.join(`./${jadi}/`, id);
    if (!fs.existsSync(pathYukiJadiBot)){
        fs.mkdirSync(pathYukiJadiBot, { recursive: true });
    }

    // Llamada a tu función para generar el code
    yukiJadiBot({
        pathYukiJadiBot,
        m,
        conn,
        args,
        usedPrefix,
        command: 'coud', // Forzamos que sea coud
        fromCommand: true
    });
}

handler.help = ['coud'];
handler.tags = ['serbot'];
handler.command = ['coud']; 
export default handler;