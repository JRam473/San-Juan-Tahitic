import { Pool } from 'pg';

// Debug: Verificar variables de entorno
console.log('🔍 Variables de entorno DB:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'UNDEFINED ❌');

// Validar que la contraseña existe
if (!process.env.DB_PASSWORD) {
  throw new Error('❌ DB_PASSWORD no está definida en las variables de entorno');
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD as string, // Forzar tipo string
  database: process.env.DB_NAME,
});

// Manejar errores de conexión
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
  process.exit(-1);
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export { pool };
export default pool;