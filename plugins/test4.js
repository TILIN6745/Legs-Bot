let handler = async (m, { text, command }) => {
  const opciones = ["piedra", "papel", "tijera"];
  const alias = {
    pi: "piedra",
    pa: "papel",
    ti: "tijera",
  };

  const emojis = {
    piedra: "🪨",
    papel: "📄",
    tijera: "✂️",
  };

  let userChoice = text?.toLowerCase();

  // convertir alias
  if (alias[userChoice]) userChoice = alias[userChoice];

  // validar
  if (!opciones.includes(userChoice)) {
    return m.reply(`✋ Elige una opción válida:\n\n- piedra (pi)\n- papel (pa)\n- tijera (ti)\n\nEjemplo: .${command} pi`);
  }

  const botChoice = opciones[Math.floor(Math.random() * 3)];

  let resultado;
  if (userChoice === botChoice) {
    resultado = "🤝 ¡Empate!";
  } else if (
    (userChoice === "piedra" && botChoice === "tijera") ||
    (userChoice === "papel" && botChoice === "piedra") ||
    (userChoice === "tijera" && botChoice === "papel")
  ) {
    resultado = "🎉 ¡Ganaste!";
  } else {
    resultado = "😢 Perdiste!";
  }

  m.reply(
`Tú elegiste: ${emojis[userChoice]} (${userChoice})
El bot eligió: ${emojis[botChoice]} (${botChoice})

${resultado}`
  );
};

handler.command = /^ppt|piedrapapeltijera$/i;

export default handler;