// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto123";

// 📦 Registro de novo usuário
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

    try {
        // Verifica se usuário já existe
        const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ error: "Usuário já registrado" });

        const hash = await bcrypt.hash(password, 10);

        const result = await db.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name || "Usuário", email, hash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro em /register:", err);
        res.status(500).json({ error: "Erro interno ao registrar usuário" });
    }
});

// 🔑 Login
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

        // Envia o token via cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // deixa true se usar https
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

// 🚪 Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout realizado com sucesso" });
});

// 🧠 Verifica sessão (para o front saber se o token é válido)
router.get("/me", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não autenticado" });

    try {
        const decoded = jwt.verify(token, SECRET);
        const result = await db.query("SELECT id, name, email FROM users WHERE id = $1", [
            decoded.id,
        ]);

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Usuário não encontrado" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro em /me:", err);
        res.status(401).json({ error: "Token inválido" });
    }
});

module.exports = router;
