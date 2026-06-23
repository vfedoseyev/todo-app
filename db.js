const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'todos.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    text    TEXT    NOT NULL,
    done    INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)
module.exports = db