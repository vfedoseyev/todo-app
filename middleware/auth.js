const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Нет токена' })
  }

  try {
    const payload = jwt.verify(header.replace('Bearer ', ''), JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Токен недействителен' })
  }
}

module.exports = requireAuth