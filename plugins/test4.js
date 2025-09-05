let handler = async (m, { text, command }) => {
  const opciones = ["piedra", "papel", "tijera"];
  const userChoice = text?.toLowerCase();
  const botChoice = opciones[Math.floor(Math.random() * 3)];

  if (!opciones.includes(userChoice)) {
    return m.reply(`✋ Elige una opción válida:\n\n- piedra\n- papel\n- tijera\n\nEjemplo: .${command} piedra`);
  }

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

  m.reply(`Tú elegiste: ${userChoice}\nEl bot eligió: ${botChoice}\n\n${resultado}`);
};

handler.command = /^ppt|piedrapapeltijera$/i;

export default handler;