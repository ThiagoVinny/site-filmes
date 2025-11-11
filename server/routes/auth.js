// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

// Registro
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Email e senha são obrigatórios" });

        const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ error: "Email já cadastrado" });

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, passwordHash]
        );

        const user = result.rows[0];

        // cria perfil básico
        await db.query(
            "INSERT INTO profiles (user_id, display_name, bio) VALUES ($1, $2, $3)",
            [user.id, email.split("@")[0], "Amante de séries e cinema"]
        );

        const token = generateToken(user);

        res.status(201).json({
            user,
            token,
        });
    } catch (err) {
        console.error("Erro em /auth/register", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query(
            "SELECT id, email, password_hash FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0)
            return res.status(400).json({ error: "Credenciais inválidas" });

        const user = result.rows[0];

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(400).json({ error: "Credenciais inválidas" });

        const token = generateToken(user);

        res.json({
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (err) {
        console.error("Erro em /auth/login", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

module.exports = router;
