// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto123";

// ------------------------------------------------------
// 📦 Registrar usuário
// ------------------------------------------------------
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

    try {
        // Verifica se já existe
        const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ error: "Usuário já registrado" });

        const hash = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
                 RETURNING id, name, email`,
            [name || "Usuário", email, hash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro em /register:", err);
        res.status(500).json({ error: "Erro interno ao registrar usuário" });
    }
});

// ------------------------------------------------------
// 🔐 Login
// ------------------------------------------------------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0)
            return res.status(400).json({ error: "Usuário não encontrado" });

        const user = result.rows[0];

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ error: "Senha incorreta" });

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

        // Envia token via cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error("Erro em /login:", err);
        res.status(500).json({ error: "Erro interno ao logar" });
    }
});

// ------------------------------------------------------
// 🚪 Logout
// ------------------------------------------------------
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout realizado com sucesso" });
});

// ------------------------------------------------------
// 🧠 /auth/me — retorna dados do usuário logado
// ------------------------------------------------------
router.get("/me", auth, async (req, res) => {
    try {
        const userId = req.userId;

        const result = await db.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Usuário não encontrado" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro no /auth/me:", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

module.exports = router;
