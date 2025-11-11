import React from "react";
import { useNavigate } from "react-router-dom";
import "./CatalogoLibros.css";

function CatalogoLibros({ onAgregar }) {
  const navigate = useNavigate();

  // 📚 Lista completa de libros
  const libros = [
    { id: 1, titulo: "Don Quijote de la Mancha", precio: 90, imagen: "/img/libros/donquijotedelamancha.jpg" },
    { id: 2, titulo: "El Principito", precio: 70, imagen: "/img/libros/elprincipito.jpg" },
    { id: 3, titulo: "La Odisea", precio: 150, imagen: "/img/libros/laodisea.jpg" },
    { id: 4, titulo: "Matilda", precio: 180, imagen: "/img/libros/matilda.jpg" },
    { id: 5, titulo: "Hansel y Gretel", precio: 110, imagen: "/img/libros/hanselygretel.jpg" },
    { id: 6, titulo: "Caperucita Roja", precio: 85, imagen: "/img/libros/caperucitaroja.jpg" },
    { id: 7, titulo: "El Diario de Ana Frank", precio: 140, imagen: "/img/libros/eldiariodeanafrank.jpg" },
    { id: 8, titulo: "El Patito Feo", precio: 60, imagen: "/img/libros/elpatitofeo.jpg" },
    { id: 9, titulo: "Pinocho", precio: 90, imagen: "/img/libros/pinocho.jpg" },
  ];

  return (
    <div className="catalogo-container">

      <div className="catalogo-grid">
        {libros.map((libro) => (
          <div key={libro.id} className="libro-card">
            <img src={libro.imagen} alt={libro.titulo} />
            <h3>{libro.titulo}</h3>
            <p>Precio: Q{libro.precio}</p>
            <button onClick={() => onAgregar(libro)}>🛒 Agregar</button>
          </div>
        ))}
      </div>

      {/* 🔹 Botón para ir al detalle de pedidos */}
      <div className="ver-pedidos-container">
        <button className="btn-pedidos" onClick={() => navigate("/pedidos")}>
          📋 Ver Detalle de Pedidos
        </button>
      </div>
    </div>
  );
}

export default CatalogoLibros;
