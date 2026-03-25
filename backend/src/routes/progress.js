const router = require('express').Router();

const { pool, query } = require('../db/pool');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [progressResult, userResult] = await Promise.all([
      query(
        `
          SELECT problem_id, completed
          FROM progress
          WHERE user_id = $1
          ORDER BY problem_id
        `,
        [req.user.id]
      ),
      query(
        `
          SELECT xp, current_world
          FROM users
          WHERE id = $1
        `,
        [req.user.id]
      ),
    ]);

    return res.json({
      progress: progressResult.rows,
      completed: progressResult.rows.filter((row) => row.completed).map((row) => row.problem_id),
      xp: userResult.rows[0]?.xp ?? 0,
      currentWorld: userResult.rows[0]?.current_world ?? 1,
    });
  } catch (error) {
    console.error('Loading progress failed:', error);
    return res.status(500).json({ error: 'Unable to load progress.' });
  }
});

router.post('/complete', auth, async (req, res) => {
  const { problemId } = req.body;

  if (!problemId) {
    return res.status(400).json({ error: 'problemId is required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const problemResult = await client.query(
      `
        SELECT id, world, xp_reward
        FROM problems
        WHERE id = $1
      `,
      [problemId]
    );

    if (problemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const problem = problemResult.rows[0];
    const existingProgress = await client.query(
      `
        SELECT id, completed
        FROM progress
        WHERE user_id = $1 AND problem_id = $2
      `,
      [req.user.id, problemId]
    );

    let xpAwarded = 0;

    if (existingProgress.rows.length === 0) {
      await client.query(
        `
          INSERT INTO progress (user_id, problem_id, completed)
          VALUES ($1, $2, TRUE)
        `,
        [req.user.id, problemId]
      );
      xpAwarded = problem.xp_reward;
    } else if (!existingProgress.rows[0].completed) {
      await client.query(
        `
          UPDATE progress
          SET completed = TRUE
          WHERE id = $1
        `,
        [existingProgress.rows[0].id]
      );
      xpAwarded = problem.xp_reward;
    }

    const userResult = await client.query(
      `
        UPDATE users
        SET xp = xp + $1,
            current_world = GREATEST(current_world, $2)
        WHERE id = $3
        RETURNING xp, current_world
      `,
      [xpAwarded, problem.world, req.user.id]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      xpAwarded,
      totalXP: userResult.rows[0].xp,
      currentWorld: userResult.rows[0].current_world,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Completing problem failed:', error);
    return res.status(500).json({ error: 'Unable to save progress.' });
  } finally {
    client.release();
  }
});

router.get('/leaderboard', async (_req, res) => {
  try {
    const result = await query(
      `
        SELECT email, xp
        FROM users
        ORDER BY xp DESC, email ASC
        LIMIT 10
      `
    );

    return res.json({
      leaderboard: result.rows.map((row) => ({
        name: row.email.split('@')[0],
        xp: row.xp,
      })),
    });
  } catch (error) {
    console.error('Loading leaderboard failed:', error);
    return res.status(500).json({ error: 'Unable to load the leaderboard.' });
  }
});

module.exports = router;
