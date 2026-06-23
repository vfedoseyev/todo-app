require('dotenv').config()
const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', require('./routes/auth'))
app.use('/api/todos', require('./routes/todos'))

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000')
})