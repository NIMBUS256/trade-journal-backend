import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("trades.db");
db.exec(`CREATE TABLE IF NOT EXISTS trades (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, data TEXT);`);

app.get("/trades", (req, res) => {
  const rows = db.prepare("SELECT * FROM trades ORDER BY id DESC").all();
  res.json(rows.map(r => ({...JSON.parse(r.data), id: r.id, date: r.date })));
});

app.post("/trades", (req, res) => {
  const { date,...data } = req.body;
  const result = db.prepare("INSERT INTO trades (date, data) VALUES (?,?)").run(date, JSON.stringify(data));
  res.json({ id: result.lastInsertRowid });
});

app.delete("/trades/:id", (req, res) => {
  db.prepare("DELETE FROM trades WHERE id =?").run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
