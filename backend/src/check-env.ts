import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('✅ Verificación de variables de entorno:');
console.log('========================================');

const requiredVars = [
  'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'JWT_SECRET', 'PORT'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  console.log(`${status} ${varName}: ${value || 'NO DEFINIDO'}`);
});

// Verificar todas las requeridas
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('\n❌ Variables faltantes:', missingVars);
  console.log('💡 Asegúrate de que el archivo .env esté en la raíz del proyecto');
  process.exit(1);
} else {
  console.log('\n🎉 Todas las variables están presentes!');
  process.exit(0);
}