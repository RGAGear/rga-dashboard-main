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

  const checks = [
    ['session_id', 'chat_sessions'],
  ];

  for (const [column, table] of checks) {
    const query = `SELECT COUNT(*)::int AS cnt FROM chat_messages WHERE ${column} IS NOT NULL AND ${column} NOT IN (SELECT id FROM ${table})`;
    const result = await client.query(query);
    const count = Number(result.rows[0]?.cnt || 0);
    console.log(`[repair-chat-fk] ${column} -> ${table}: ${count}`);

    if (count > 0) {
      await client.query(`UPDATE chat_messages SET ${column}=NULL WHERE ${column} IS NOT NULL AND ${column} NOT IN (SELECT id FROM ${table})`);
      console.log(`[repair-chat-fk] cleared ${count} orphaned values for ${column}`);
    }
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
