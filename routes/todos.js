const express = require('express')
const router = express.Router()
const db = require('../db')
const requireAuth = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(req.userId)
  res.json(todos)
})

router.post('/', requireAuth, (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'Поле text обязательно' })
  }

  const result = db.prepare('INSERT INTO todos (text, user_id) VALUES (?, ?)').run(text, req.userId)
  const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(newTodo)
})

router.patch('/:id', requireAuth, (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!todo) return res.status(404).json({ error: 'Задача не найдена' })

  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(todo.done ? 0 : 1, req.params.id)
  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id)
  res.json(updated)
})

router.delete('/:id', requireAuth, (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!todo) return res.status(404).json({ error: 'Задача не найдена' })

  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

module.exports = router