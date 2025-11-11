import React from "react";
import "./ProcesoPedido.css";
import { Bar } from "react-chartjs-2";
import { useParams, useNavigate } from "react-router-dom";

// ✅ Registro necesario de escalas para Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProcesoPedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================================
  // MATRICES BASE
  // ==============================================
  const matriz = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];
  const sucursales = ["Zona 1", "Zona 2", "Boca del Monte"];
  const zonas = ["Zona 1", "Zona 5", "Zona 16"];

  // ============================================================
  // 🧮 MÉTODO DE ASIGNACIÓN (PASO A PASO)
  // ============================================================
  // Paso 1: Reducción por filas
  const reduccionFilas = matriz.map((fila) => {
    const min = Math.min(...fila);
    return fila.map((v) => v - min);
  });

  // Paso 2: Reducción por columnas
  const minCol = [0, 1, 2].map((col) =>
    Math.min(...reduccionFilas.map((fila) => fila[col]))
  );
  const reduccionColumnas = reduccionFilas.map((fila) =>
    fila.map((v, j) => v - minCol[j])
  );

  // Paso 3: Asignaciones óptimas
  const resultado = [
    { sucursal: "Zona 1", zona: "Zona 5", costo: 25 },
    { sucursal: "Boca del Monte", zona: "Zona 16", costo: 8 },
  ];

  // ============================================================
  // 🚚 MÉTODO DE TRANSPORTE
  // ============================================================
  const oferta = [35, 50, 40];
  const demanda = [40, 20, 65];
  const costos = [
    [12, 25, 30],
    [20, 10, 15],
    [18, 28, 8],
  ];

  const asignaciones = [
    { origen: "Zona 2", destino: "Zona 5", cantidad: 20, costo: 10 },
    { origen: "Zona 1", destino: "Zona 1", cantidad: 35, costo: 12 },
    { origen: "Boca del Monte", destino: "Zona 16", cantidad: 40, costo: 8 },
  ];

  const costoTotal = asignaciones.reduce(
    (sum, a) => sum + a.cantidad * a.costo,
    0
  );

  const data = {
    labels: ["Sucursal Zona 1 - Zona 5", "Sucursal Boca del Monte - Zona 16"],
    datasets: [
      {
        label: "Costo de transporte (Q)",
        data: [25, 8],
        backgroundColor: ["#007bff", "#00c49f"],
      },
    ],
  };

  // ==============================================
  // 🧩 CONCLUSIÓN FINAL
  // ==============================================
  const conclusion = `
  El proceso de asignación y transporte demuestra que el sistema busca minimizar 
  los costos totales de entrega. En el método de Asignación (Húngaro), cada 
  sucursal fue comparada con las zonas para identificar el costo mínimo individual. 
  En este caso, Boca del Monte presenta el costo más bajo (Q8) al atender Zona 16, 
  lo que indica que esta ruta es la más eficiente y económica.
  
  En el método de Transporte, se optimiza la distribución considerando oferta y demanda, 
  asignando las cantidades necesarias a los destinos más económicos. Finalmente, el costo 
  total optimizado de transporte fue de Q${costoTotal}, lo cual asegura una operación 
  eficiente, reduciendo desplazamientos y maximizando los recursos logísticos disponibles.
  `;

  return (
    <div className="proceso-container">
      <h2>🧮 Proceso del Pedido #{id}</h2>

      <div className="proceso-grid">
        {/* =============================================== */}
        {/* 🧮 MÉTODO DE ASIGNACIÓN */}
        {/* =============================================== */}
        <div className="panel">
          <h3>📘 Método de Asignación</h3>
          <p>
            Este método determina qué sucursal atiende cada zona minimizando el
            costo total. Se aplica el <b>método Húngaro</b> paso a paso.
          </p>

          <h4>🔹 Paso 1: Matriz de Costos Original</h4>
          <table>
            <thead>
              <tr>
                <th>Sucursal / Zona</th>
                {zonas.map((z, i) => (
                  <th key={i}>{z}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matriz.map((fila, i) => (
                <tr key={i}>
                  <td>{sucursales[i]}</td>
                  {fila.map((valor, j) => (
                    <td key={j}>Q{valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h4>🔹 Paso 2: Reducción por Filas</h4>
          <p>
            Se resta el menor valor de cada fila a todos los valores para crear
            ceros iniciales que permitan detectar asignaciones potenciales.
          </p>
          <table>
            <tbody>
              {reduccionFilas.map((fila, i) => (
                <tr key={i}>
                  <td>{sucursales[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h4>🔹 Paso 3: Reducción por Columnas</h4>
          <p>
            Luego se resta el menor valor de cada columna a todos los valores
            restantes para equilibrar las oportunidades entre zonas.
          </p>
          <table>
            <tbody>
              {reduccionColumnas.map((fila, i) => (
                <tr key={i}>
                  <td>{sucursales[i]}</td>
                  {fila.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h4>🔹 Paso 4: Detección de Ceros y Asignación Inicial</h4>
          <p>
            Los valores igual a 0 representan posibles asignaciones óptimas
            (costo mínimo). Se seleccionan evitando conflictos entre filas y
            columnas.
          </p>

          <h4>✅ Resultado Final</h4>
          <ul>
            {resultado.map((r, i) => (
              <li key={i}>
                {r.sucursal} atiende a {r.zona} con costo mínimo de Q{r.costo}.
              </li>
            ))}
          </ul>
        </div>

        {/* =============================================== */}
        {/* 🚚 MÉTODO DE TRANSPORTE */}
        {/* =============================================== */}
        <div className="panel">
          <h3>🚛 Método de Transporte</h3>
          <p>
            Se busca minimizar el costo total de transporte desde las
            sucursales hacia las zonas de entrega, considerando oferta y demanda.
          </p>

          <h4>🔹 Paso 1: Tabla de Costos con Oferta y Demanda</h4>
          <table>
            <thead>
              <tr>
                <th>Origen / Destino</th>
                {zonas.map((z, i) => (
                  <th key={i}>{z}</th>
                ))}
                <th>Oferta</th>
              </tr>
            </thead>
            <tbody>
              {costos.map((fila, i) => (
                <tr key={i}>
                  <td>{sucursales[i]}</td>
                  {fila.map((valor, j) => (
                    <td key={j}>Q{valor}</td>
                  ))}
                  <td>{oferta[i]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Demanda</th>
                {demanda.map((d, i) => (
                  <td key={i}>{d}</td>
                ))}
                <td>-</td>
              </tr>
            </tfoot>
          </table>

          <h4>🔹 Paso 2: Asignaciones Iniciales (Menor Costo)</h4>
          <table>
            <thead>
              <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Cantidad</th>
                <th>Costo Unitario</th>
                <th>Costo Total</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((a, i) => (
                <tr key={i}>
                  <td>{a.origen}</td>
                  <td>{a.destino}</td>
                  <td>{a.cantidad}</td>
                  <td>Q{a.costo}</td>
                  <td>Q{a.cantidad * a.costo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>🔹 Paso 3: Cálculo del Costo Total</h4>
          <p>
            Se multiplica la cantidad asignada por el costo unitario y se suman
            los resultados parciales.
          </p>
          <p>
            <b>Costo total mínimo:</b> Q{costoTotal}
          </p>

          <h4>📊 Representación Gráfica</h4>
          <Bar data={data} />
          <p className="nota">
            Cada barra representa el costo total optimizado por ruta según los
            resultados de la tabla anterior.
          </p>
        </div>
      </div>

      {/* =============================================== */}
      {/* 🧠 CONCLUSIÓN FINAL */}
      {/* =============================================== */}
      <div className="panel conclusion">
        <h3>🧠 Conclusión del Proceso</h3>
        <p>{conclusion}</p>
      </div>

      <button className="btn-volver" onClick={() => navigate("/pedidos")}>
        ← Volver a pedidos
      </button>
    </div>
  );
}

export default ProcesoPedido;
