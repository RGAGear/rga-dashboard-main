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

  const countRes = await client.query(
    'SELECT COUNT(*)::int AS cnt FROM chat_messages WHERE session_id IS NOT NULL AND session_id NOT IN (SELECT id FROM chat_sessions)'
  );
  const cnt = Number(countRes.rows[0]?.cnt || 0);
  console.log(`[repair-chat-orphans] orphan chat_messages: ${cnt}`);

  if (cnt > 0) {
    await client.query(
      'DELETE FROM chat_messages WHERE session_id IS NOT NULL AND session_id NOT IN (SELECT id FROM chat_sessions)'
    );
    console.log(`[repair-chat-orphans] deleted ${cnt} orphaned chat_messages`);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
