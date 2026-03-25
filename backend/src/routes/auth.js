const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { query } = require('../db/pool');
const { auth, signToken } = require('../middleware/auth');

function buildUser(row, completed = []) {
  return {
    id: row.id,
    email: row.email,
    name: row.name || row.email.split('@')[0],
    xp: row.xp,
    currentWorld: row.current_world,
    completed,
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const safeName = (name || '').trim() || normalizedEmail.split('@')[0];
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'That email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `
        INSERT INTO users (email, name, password)
        VALUES ($1, $2, $3)
        RETURNING id, email, name, xp, current_world
      `,
      [normalizedEmail, safeName, hashedPassword]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({
      token,
      user: buildUser(user),
    });
  } catch (error) {
    console.error('Signup failed:', error);
    return res.status(500).json({ error: 'Unable to create the account.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await query(
      `
        SELECT id, email, name, password, xp, current_world
        FROM users
        WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const progress = await query(
      `
        SELECT problem_id
        FROM progress
        WHERE user_id = $1 AND completed = TRUE
        ORDER BY problem_id
      `,
      [user.id]
    );

    const token = signToken({ id: user.id, email: user.email });

    return res.json({
      token,
      user: buildUser(user, progress.rows.map((row) => row.problem_id)),
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Unable to log in.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const userResult = await query(
      `
        SELECT id, email, name, xp, current_world
        FROM users
        WHERE id = $1
      `,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const progress = await query(
      `
        SELECT problem_id
        FROM progress
        WHERE user_id = $1 AND completed = TRUE
        ORDER BY problem_id
      `,
      [req.user.id]
    );

    return res.json({
      user: buildUser(userResult.rows[0], progress.rows.map((row) => row.problem_id)),
    });
  } catch (error) {
    console.error('Fetching current user failed:', error);
    return res.status(500).json({ error: 'Unable to load the current user.' });
  }
});

module.exports = router;
