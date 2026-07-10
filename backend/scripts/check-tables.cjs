const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const tables = ['tenants','users','integrations','chat_sessions','chat_messages','alert_rules','alerts'];
  for (const table of tables) {
    const res = await client.query(`SELECT to_regclass('public.${table}') AS exists`);
    console.log(`${table}: ${res.rows[0].exists ? 'OK' : 'MISSING'}`);
  }
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
