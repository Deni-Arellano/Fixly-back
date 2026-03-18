import 'dotenv/config';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión al pool de MySQL exitosa');
    connection.release();
  } catch (err) {
    console.error('Error al conectar al pool de la base de datos:', err);
    process.exit(1);
  }
}

testConnection();

export default pool;
