const jwt = require('jsonwebtoken');

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add it to backend/.env before starting the server.');
  }

  return process.env.JWT_SECRET;
}

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : '';

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    req.user = jwt.verify(token, getSecret());
    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

module.exports = { auth, signToken };
