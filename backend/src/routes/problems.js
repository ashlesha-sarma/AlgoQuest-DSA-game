const router = require('express').Router();

const { query } = require('../db/pool');

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `
        SELECT id, title, world, type, difficulty, xp_reward
        FROM problems
        ORDER BY world ASC, title ASC
      `
    );

    return res.json({ problems: result.rows });
  } catch (error) {
    console.error('Loading problems failed:', error);
    return res.status(500).json({ error: 'Unable to load problems.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `
        SELECT id, title, world, type, difficulty, xp_reward
        FROM problems
        WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    return res.json({ problem: result.rows[0] });
  } catch (error) {
    console.error('Loading problem failed:', error);
    return res.status(500).json({ error: 'Unable to load the problem.' });
  }
});

module.exports = router;
