const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, age INTEGER)");
  
  const stmt = db.prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
  stmt.run("Alice", "alice@example.com", 25);
  stmt.run("Bob", "bob@example.com", 30);
  stmt.finalize();
});

db.close();
