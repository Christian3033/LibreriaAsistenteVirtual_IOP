import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Envio.css";
import L from "leaflet";
import axios from "axios";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const direccion = data.display_name || "Dirección no disponible";
        onSelect({ lat, lng, direccion });
      } catch (error) {
        console.error("Error al obtener dirección:", error);
        onSelect({ lat, lng, direccion: "Error al obtener dirección" });
      }
    },
  });

  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>📍 Dirección seleccionada</Popup>
    </Marker>
  ) : null;
}

function Envio({ total, onVolver }) {
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pos, setPos] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null); // 💬 para mostrar el cuadro de agradecimiento

  const calcularEnvio = (z) => {
    const num = parseInt(z);
    if (!num) return 0;
    if (num <= 5) return 15;
    if (num <= 10) return 25;
    if (num <= 15) return 35;
    return 40;
  };

  const determinarTransporte = (z) => {
    const num = parseInt(z);
    if (!num) return { tipo: "—", icon: "" };
    if (num <= 5) return { tipo: "Moto", icon: "🏍️", clase: "anim-moto" };
    if (num <= 10) return { tipo: "Motocicleta", icon: "🏍️", clase: "anim-moto" };
    if (num <= 15) return { tipo: "Pickup", icon: "🚚", clase: "anim-truck" };
    return { tipo: "Camioneta", icon: "🚛", clase: "anim-truck" };
  };

  const envio = calcularEnvio(zona);
  const transporte = determinarTransporte(zona);
  const totalFinal = total + envio;

  const handleMapSelect = (data) => {
    setPos(data);
    setDireccion(data.direccion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/pedidos", {
        nombre,
        direccion,
        zona: `Zona ${zona}`,
        total: totalFinal, // aquí enviamos ya el total con envío incluido
      });

      setConfirmacion(res.data); // ✅ guardar los datos del backend (mensaje, totalFinal, etc.)
    } catch (error) {
      console.error("❌ Error al confirmar pedido:", error);
      setConfirmacion({ error: true, mensaje: "No se pudo confirmar el pedido. Intenta nuevamente." });
    }
  };

  return (
    <div className="envio-container">
      <h2>🚚 Detalles de Envío</h2>

      {!confirmacion ? (
        <form className="envio-form" onSubmit={handleSubmit}>
          <label>
            Nombre del cliente:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Ana Gómez"
              required
            />
          </label>

          <label>
            Zona:
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            >
              <option value="">Seleccione zona</option>
              {Array.from({ length: 21 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Zona {i + 1}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dirección:
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Haz clic en el mapa para seleccionar"
              required
            />
          </label>

          <MapContainer
            center={[14.6349, -90.5069]}
            zoom={13}
            style={{
              height: "420px",
              width: "100%",
              borderRadius: "15px",
              marginTop: "15px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onSelect={handleMapSelect} />
          </MapContainer>

          <div className="resumen">
            <p><strong>Zona:</strong> {zona ? `Zona ${zona}` : "No seleccionada"}</p>
            <p className="transporte">
              <strong>Transporte:</strong> {transporte.tipo}{" "}
              <span className={transporte.clase}>{transporte.icon}</span>
            </p>
            <p><strong>Subtotal:</strong> Q{total.toFixed(2)}</p>
            <p><strong>Envío:</strong> Q{envio.toFixed(2)}</p>
            <hr />
            <p className="total"><strong>Total final:</strong> Q{totalFinal.toFixed(2)}</p>
          </div>

          <div className="botones">
            <button type="button" onClick={onVolver} className="btn-volver">⬅ Volver</button>
            <button type="submit" className="btn-confirmar">Confirmar pedido</button>
          </div>
        </form>
      ) : (
        <div className="confirmacion">
          {confirmacion.error ? (
            <p className="error">{confirmacion.mensaje}</p>
          ) : (
            <>
              <h3>🎉 ¡Gracias por tu compra, {nombre}!</h3>
              <p>Te comentamos que el pago se realiza <strong>contra entrega</strong>.</p>
              <p>Mensajero asignado <strong>{confirmacion.mensajero}</strong> </p>
              <p>El mensajero lleva cambio, si tu pago es en efectivo y POS, si tu pago es en tarjeta</p>
              <p><strong>Total a cancelar:</strong> Q{confirmacion.totalFinal.toFixed(2)}</p>
              <p><strong>Sucursal de despacho:</strong> {confirmacion.sucursal}</p>

            
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Envio;
