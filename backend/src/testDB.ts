import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Verificando conexión a PostgreSQL en Docker...');
console.log('Configuración:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Puerto:', process.env.DB_PORT);
console.log('  Usuario:', process.env.DB_USER);
console.log('  Base de datos:', process.env.DB_NAME);
console.log('  Contraseña:', process.env.DB_PASSWORD ? '***' : 'UNDEFINED ❌');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Opciones adicionales para Docker
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

(async () => {
  try {
    console.log('\n🔄 Intentando conectar...');
    
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL en Docker');

    // Consulta de prueba
    const result = await client.query('SELECT version(), NOW() as current_time');
    console.log('📊 Información de PostgreSQL:');
    console.log('   Versión:', result.rows[0].version.split(',')[0]);
    console.log('   Hora del servidor:', result.rows[0].current_time);

    // Verificar tablas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tablas en la base de datos:', tables.rows.length);

    client.release();
    await pool.end();
    
    console.log('✅ Prueba completada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error de conexión:');
    
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message);
      
      if (error.message.includes('connection refused')) {
        console.log('\n💡 Solución: Verifica que:');
        console.log('   1. Docker esté ejecutándose');
        console.log('   2. Contenedor de PostgreSQL esté activo: docker-compose ps');
        console.log('   3. Puerto 5432 no esté ocupado por otra aplicación');
      } else if (error.message.includes('password authentication')) {
        console.log('\n💡 Solución: Verifica usuario/contraseña en docker-compose.yml y .env');
      }
    }

    process.exit(1);
  }
})();