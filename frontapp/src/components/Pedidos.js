import React, { useEffect, useState } from "react";
import "./Pedidos.css";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===========================================
  // 🔁 FUNCIÓN PARA CARGAR PEDIDOS DESDE BACKEND
  // ===========================================
  const cargarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pedidos");
      const data = await res.json();
      setPedidos(data);
      setLoading(false);
      console.log("📦 Pedidos actualizados:", data.length);
    } catch (error) {
      console.error("❌ Error al obtener pedidos:", error);
      setLoading(false);
    }
  };

  // ===========================================
  // 🚀 useEffect: Cargar al inicio y refrescar
  // ===========================================
  useEffect(() => {
    cargarPedidos();

    // Recargar automáticamente cada 5 segundos
    const intervalo = setInterval(cargarPedidos, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // ===========================================
  // 🧾 RENDERIZADO
  // ===========================================
  return (
    <div className="pedidos-container">
      <h2>📦 Detalle de Pedidos</h2>

      {loading ? (
        <p className="cargando">⏳ Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="sin-datos">⚠️ No hay pedidos registrados.</p>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Sucursal</th>
              <th>Mensajero</th>
              <th>Total</th>
              <th>Envío</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id_pedido}>
                <td>{p.id_pedido}</td>
                <td>{p.cliente}</td>
                <td>{p.sucursal}</td>
                <td>{p.mensajero}</td>
                <td>Q{Number(p.total || 0).toFixed(2)}</td>
                <td>Q{Number(p.envio || 0).toFixed(2)}</td>
                <td>{p.estado}</td>
                <td>{p.fecha}</td>
                <td>
                  <button
                    className="btn-ver"
                    onClick={() => navigate(`/proceso/${p.id_pedido}`)}
                  >
                    Ver proceso
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ====================================== */}
      {/* 🧠 SECCIÓN DE MÉTODOS APLICADOS */}
      {/* ====================================== */}
      <div className="metodos">
        <h3>🧠 Métodos aplicados</h3>
        <p>
          <strong>Método de Asignación:</strong> Determina qué sucursal atiende
          cada pedido minimizando tiempo y distancia.
        </p>
        <p>
          <strong>Método de Transporte:</strong> Calcula la ruta más eficiente y
          el costo mínimo de envío entre sucursales y zonas.
        </p>
        <div className="nota">
          Cada pedido mostrado arriba ya ha sido procesado aplicando estos
          métodos de optimización.
        </div>
      </div>
    </div>
  );
}

export default Pedidos;
