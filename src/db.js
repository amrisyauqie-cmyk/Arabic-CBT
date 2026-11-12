const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'arabic-cbt.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 full_name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','student')), class_level INTEGER,
 student_number TEXT, is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS academic_years (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, is_active INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS materials (id INTEGER PRIMARY KEY AUTOINCREMENT, class_level INTEGER NOT NULL, semester TEXT NOT NULL, title TEXT NOT NULL, description TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS questions (
 id INTEGER PRIMARY KEY AUTOINCREMENT, class_level INTEGER NOT NULL CHECK(class_level BETWEEN 7 AND 9),
 semester TEXT NOT NULL DEFAULT 'Ganjil', material_id INTEGER, question_type TEXT NOT NULL CHECK(question_type IN ('pilihan_ganda','isian','benar_salah')),
 question_text TEXT NOT NULL, translation TEXT DEFAULT '', options_json TEXT DEFAULT '[]', answer_key TEXT NOT NULL DEFAULT '', accepted_answers TEXT DEFAULT '', explanation TEXT DEFAULT '', is_active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(material_id) REFERENCES materials(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS exams (
 id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, class_level INTEGER NOT NULL CHECK(class_level BETWEEN 7 AND 9),
 semester TEXT NOT NULL, academic_year TEXT NOT NULL DEFAULT '2026/2027', duration_minutes INTEGER NOT NULL DEFAULT 60,
 instructions TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','scheduled','active','archived')),
 starts_at TEXT, ends_at TEXT, shuffle_questions INTEGER NOT NULL DEFAULT 0, show_result INTEGER NOT NULL DEFAULT 1,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS exam_questions (
 exam_id INTEGER NOT NULL, question_id INTEGER NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
 points REAL NOT NULL DEFAULT 1, PRIMARY KEY(exam_id, question_id),
 FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,
 FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS exam_sessions (
 id INTEGER PRIMARY KEY AUTOINCREMENT, exam_id INTEGER NOT NULL, student_id INTEGER NOT NULL,
 started_at TEXT NOT NULL, submitted_at TEXT, status TEXT NOT NULL DEFAULT 'in_progress', score REAL,
 UNIQUE(exam_id, student_id), FOREIGN KEY(exam_id) REFERENCES exams(id), FOREIGN KEY(student_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS student_answers (
 id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER NOT NULL, question_id INTEGER NOT NULL,
 answer_text TEXT DEFAULT '', is_correct INTEGER, points_awarded REAL DEFAULT 0, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(session_id, question_id), FOREIGN KEY(session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
 FOREIGN KEY(question_id) REFERENCES questions(id)
);
CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, action TEXT NOT NULL, details TEXT DEFAULT '', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);

const admin = db.prepare("SELECT id FROM users WHERE username='admin'").get();
if (!admin) {
  db.prepare('INSERT INTO users (username,password_hash,full_name,role) VALUES (?,?,?,?)')
    .run('admin', bcrypt.hashSync('Admin123!', 10), 'Administrator', 'admin');
}
const year = db.prepare("SELECT id FROM academic_years WHERE name='2026/2027'").get();
if (!year) db.prepare("INSERT INTO academic_years(name,is_active) VALUES('2026/2027',1)").run();
module.exports = db;
