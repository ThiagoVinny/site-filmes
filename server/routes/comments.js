require("dotenv").config(); // Dotenv sempre na primeira linha
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 👇 CHAVE COLADA DIRETO (Para garantir o teste imediato)
// Depois, o ideal é voltar para process.env.GEMINI_API_KEY por segurança
const MY_API_KEY = "AIzaSyCHzJqIeEZG7c-MaVUwDEoMAPFtpbTzCE0";
const genAI = new GoogleGenerativeAI(MY_API_KEY);

// 📌 Criar comentário (COM DETECÇÃO DE SPOILER)
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const { series_id, content, rating, watched_at, series_name } = req.body;

        console.log("\n--- 🕵️ DEBUG: NOVO COMENTÁRIO RECEBIDO ---");
        console.log("1. Conteúdo:", content);
        console.log("2. Série:", series_name);

        if (!content || !series_id) {
            return res.status(400).json({ error: "Dados incompletos" });
        }
        let finalRating = null;
        if (rating) finalRating = Number(rating);

        // --- LÓGICA DA IA ---
        let isSpoiler = false;

        try {
            console.log("4. 🤖 Perguntando para a IA...");
            
            const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

            const context = series_name ? `da série/filme "${series_name}"` : "de uma série de TV";
            
            const prompt = `
            Atue como um moderador de spoilers.
            Analise o comentário abaixo ${context}:
            "${content}"
            
            Responda APENAS com "TRUE" se o comentário revelar spoilers importantes (mortes, finais, plot twists, revelações de identidade).
            Responda APENAS com "FALSE" se for seguro.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim().toUpperCase();

            console.log("5. 🤖 Resposta da IA:", text);

            if (text.includes("TRUE")) {
                isSpoiler = true;
                console.log("6. ✅ STATUS: Marcado como SPOILER!");
            } else {
                console.log("6. ❌ STATUS: Marcado como Seguro.");
            }

        } catch (aiError) {
            console.error("🔥 ERRO NA IA:", aiError.message);
        }
        // --------------------

        const result = await db.query(
            `INSERT INTO comments (user_id, series_id, content, rating, watched_at, is_spoiler)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, series_id, content, finalRating, watched_at || null, isSpoiler]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro geral ao salvar:", err);
        res.status(500).json({ error: "Erro ao criar comentário" });
    }
});

// 📌 Comentários por série
router.get("/series/:seriesId", async (req, res) => {
    try {
        const { seriesId } = req.params;
        const result = await db.query(
            `SELECT c.*, u.name AS user_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.series_id = $1
             ORDER BY c.created_at DESC`,
            [seriesId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao carregar" });
    }
});

// 📌 Comentários por usuário
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(
            `SELECT * FROM comments WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao carregar" });
    }
});

// 📌 Deletar
router.delete("/:id", auth, async (req, res) => {
    try {
        // Primeiro verifica se é o dono (opcional, mas bom pra segurança)
        // await db.query(...)
        
        await db.query("DELETE FROM comments WHERE id = $1", [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar" });
    }
});

// 📌 Update (simplificado)
router.put("/:id", auth, async (req, res) => {
    try {
        const { content } = req.body;
        await db.query("UPDATE comments SET content = $1 WHERE id = $2", [content, req.params.id]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Erro update" });
    }
});

module.exports = router;