const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return res.status(400).json({ error: 'Пользователь уже существует' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashed)
  const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET)
  res.status(201).json({ token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET)
  res.json({ token })
})

module.exports = router