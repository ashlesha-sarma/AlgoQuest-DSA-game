CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  current_world INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problems (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  world INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  xp_reward INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id VARCHAR(50) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS progress_set_updated_at ON progress;
CREATE TRIGGER progress_set_updated_at
BEFORE UPDATE ON progress
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO problems (id, title, world, type, difficulty, xp_reward) VALUES
  ('bubble', 'Bubble Sort Path', 1, 'bubble', 'easy', 10),
  ('window', 'Sliding Window Quest', 1, 'window', 'medium', 20),
  ('linked', 'Reverse the River', 2, 'linked', 'medium', 20),
  ('bfs', 'BFS Labyrinth', 3, 'bfs', 'medium', 20),
  ('parens', 'Bracket Guardian', 4, 'parens', 'hard', 30)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    world = EXCLUDED.world,
    type = EXCLUDED.type,
    difficulty = EXCLUDED.difficulty,
    xp_reward = EXCLUDED.xp_reward;
