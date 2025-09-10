import { pool } from "./utils/db";

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error conectando a la BD:", error);
    process.exit(1);
  }
})();

