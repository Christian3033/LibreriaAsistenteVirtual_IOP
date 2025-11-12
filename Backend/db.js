// =====================================
// 🔌 CONEXIÓN A BASE DE DATOS MYSQL
// =====================================
const mysql = require('mysql2');

// Crear conexión a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',        // Servidor
  user: 'root',             // Usuario de MySQL
  password: '@Admin123',    // ⚠️ tu contraseña
  database: 'libreria_db',  // 👈 nombre correcto de tu base
  port: 3306                // Puerto por defecto
});

// Verificar la conexión
conexion.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

module.exports = conexion;
