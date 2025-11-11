import React, { useState } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [mensajes, setMensajes] = useState([
    { texto: "¡Hola! 😊 Soy tu asistente virtual de la librería.", deUsuario: false },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [visible, setVisible] = useState(true);

  // Enviar mensaje al backend
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const mensajeUsuario = { texto: nuevoMensaje, deUsuario: true };
    setMensajes((msgs) => [...msgs, mensajeUsuario]);
    setNuevoMensaje("");

    try {
      // Si el usuario dice "gracias", el bot responde directamente sin ir a Dialogflow
      const mensajeLower = nuevoMensaje.toLowerCase();
      if (mensajeLower.includes("gracias") || mensajeLower.includes("grac")) {
        const respuestaBot = {
          texto: "😊 ¡Con gusto! Si necesitas algo más, aquí estaré para ayudarte 📚",
          deUsuario: false,
        };
        setMensajes((msgs) => [...msgs, respuestaBot]);
        return;
      }

      // Enviar a Dialogflow
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: nuevoMensaje }),
      });
      const data = await res.json();

      const respuestaBot = {
        texto: data.respuesta || "No tengo una respuesta para eso 😅",
        deUsuario: false,
      };

      // ✅ Solo agregamos una vez el mensaje del usuario y la respuesta del bot
      setMensajes((msgs) => [...msgs, respuestaBot]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMensajes((msgs) => [
        ...msgs,
        { texto: "⚠️ Hubo un problema al conectar con el servidor.", deUsuario: false },
      ]);
    }
  };

  return (
    <div className={`chatbot-container ${visible ? "visible" : "minimizado"}`}>
      <div className="chatbot-header" onClick={() => setVisible(!visible)}>
        💬 Librería Virtual
        <span className="toggle-btn">{visible ? "−" : "+"}</span>
      </div>

      {visible && (
        <>
          <div className="chatbot-body">
            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`mensaje ${msg.deUsuario ? "usuario" : "bot"}`}
              >
                {msg.texto}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && enviarMensaje()}
            />
            <button onClick={enviarMensaje}>Enviar</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatBot;
