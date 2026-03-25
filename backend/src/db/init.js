const { pool } = require('./pool');

const problemSeeds = [
  ['bubble', 'Bubble Sort Path', 1, 'bubble', 'easy', 10],
  ['window', 'Sliding Window Quest', 1, 'window', 'medium', 20],
  ['linked', 'Reverse the River', 2, 'linked', 'medium', 20],
  ['bfs', 'BFS Labyrinth', 3, 'bfs', 'medium', 20],
  ['parens', 'Bracket Guardian', 4, 'parens', 'hard', 30],
];

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        xp INTEGER NOT NULL DEFAULT 0,
        current_world INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS problems (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        world INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        xp_reward INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_id VARCHAR(50) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, problem_id)
      )
    `);

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password TEXT
    `);

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0
    `);

    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'password_hash'
        ) THEN
          EXECUTE 'UPDATE users SET password = COALESCE(password, password_hash) WHERE password IS NULL';
        END IF;
      END
      $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'current_world' AND data_type <> 'integer'
        ) THEN
          ALTER TABLE users ADD COLUMN IF NOT EXISTS current_world_temp INTEGER NOT NULL DEFAULT 1;
          UPDATE users
          SET current_world_temp = CASE LOWER(COALESCE(current_world::text, ''))
            WHEN 'arrays' THEN 1
            WHEN 'pointers' THEN 2
            WHEN 'graphs' THEN 3
            WHEN 'stacks' THEN 4
            ELSE 1
          END;
          ALTER TABLE users DROP COLUMN current_world;
          ALTER TABLE users RENAME COLUMN current_world_temp TO current_world;
        END IF;
      END
      $$;
    `);

    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS current_world INTEGER NOT NULL DEFAULT 1
    `);

    await client.query(`
      ALTER TABLE problems
      ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) NOT NULL DEFAULT 'easy'
    `);

    await client.query(`
      ALTER TABLE problems
      ADD COLUMN IF NOT EXISTS xp_reward INTEGER NOT NULL DEFAULT 10
    `);

    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'problems' AND column_name = 'world' AND data_type <> 'integer'
        ) THEN
          ALTER TABLE problems ADD COLUMN IF NOT EXISTS world_temp INTEGER NOT NULL DEFAULT 1;
          UPDATE problems
          SET world_temp = CASE LOWER(COALESCE(world::text, ''))
            WHEN 'arrays' THEN 1
            WHEN 'pointers' THEN 2
            WHEN 'graphs' THEN 3
            WHEN 'stacks' THEN 4
            ELSE 1
          END;
          ALTER TABLE problems DROP COLUMN world;
          ALTER TABLE problems RENAME COLUMN world_temp TO world;
        END IF;
      END
      $$;
    `);

    await client.query(`
      ALTER TABLE progress
      ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT FALSE
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS users_set_updated_at ON users
    `);
    await client.query(`
      CREATE TRIGGER users_set_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS progress_set_updated_at ON progress
    `);
    await client.query(`
      CREATE TRIGGER progress_set_updated_at
      BEFORE UPDATE ON progress
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);

    for (const [id, title, world, type, difficulty, xpReward] of problemSeeds) {
      await client.query(
        `
          INSERT INTO problems (id, title, world, type, difficulty, xp_reward)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE
          SET title = EXCLUDED.title,
              world = EXCLUDED.world,
              type = EXCLUDED.type,
              difficulty = EXCLUDED.difficulty,
              xp_reward = EXCLUDED.xp_reward
        `,
        [id, title, world, type, difficulty, xpReward]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };
