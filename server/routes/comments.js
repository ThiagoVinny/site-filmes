// server/routes/comments.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// 📌 Criar comentário (precisa estar logado)
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.userId;
        const { series_id, content, rating, watched_at } = req.body;

        if (!content || !series_id) {
            return res.status(400).json({ error: "Dados incompletos" });
        }

        // validação de rating (se vier)
        let finalRating = null;
        if (rating !== undefined && rating !== null && rating !== "") {
            const r = Number(rating);
            if (Number.isNaN(r) || r < 1 || r > 5) {
                return res
                    .status(400)
                    .json({ error: "Rating deve ser um número entre 1 e 5" });
            }
            finalRating = r;
        }

        const result = await db.query(
            `INSERT INTO comments (user_id, series_id, content, rating, watched_at)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [userId, series_id, content, finalRating, watched_at || null]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao criar comentário:", err);
        res.status(500).json({ error: "Erro ao criar comentário" });
    }
});

// 📌 Comentários por série (público)
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
        console.error("Erro ao carregar comentários:", err);
        res.status(500).json({ error: "Erro ao carregar comentários" });
    }
});

// 📌 Comentários por usuário (para o perfil)
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await db.query(
            `SELECT *
             FROM comments
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao carregar comentários do usuário:", err);
        res.status(500).json({ error: "Erro ao carregar comentários do usuário" });
    }
});

// 📌 Atualizar comentário (só dono pode editar)
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { content, rating, watched_at } = req.body;

        const existingResult = await db.query(
            "SELECT * FROM comments WHERE id = $1",
            [id]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }

        const existing = existingResult.rows[0];

        // garante que só o dono edita
        if (String(existing.user_id) !== String(userId)) {
            return res.status(403).json({ error: "Você não pode editar este comentário" });
        }

        // se nada veio pra atualizar
        if (
            content === undefined &&
            rating === undefined &&
            watched_at === undefined
        ) {
            return res
                .status(400)
                .json({ error: "Nenhum campo enviado para atualização" });
        }

        // trata rating (se vier)
        let finalRating = existing.rating;
        if (rating !== undefined) {
            if (rating === null || rating === "") {
                finalRating = null;
            } else {
                const r = Number(rating);
                if (Number.isNaN(r) || r < 1 || r > 5) {
                    return res
                        .status(400)
                        .json({ error: "Rating deve ser um número entre 1 e 5" });
                }
                finalRating = r;
            }
        }

        const finalContent =
            content !== undefined && content !== null ? content : existing.content;
        const finalWatchedAt =
            watched_at !== undefined ? watched_at : existing.watched_at;

        const updated = await db.query(
            `UPDATE comments
             SET content = $1,
                 rating = $2,
                 watched_at = $3
             WHERE id = $4
             RETURNING *`,
            [finalContent, finalRating, finalWatchedAt, id]
        );

        res.json(updated.rows[0]);
    } catch (err) {
        console.error("Erro ao atualizar comentário:", err);
        res.status(500).json({ error: "Erro ao atualizar comentário" });
    }
});

// 📌 Deletar comentário (só dono pode deletar)
router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const existingResult = await db.query(
            "SELECT * FROM comments WHERE id = $1",
            [id]
        );

        if (existingResult.rows.length === 0) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }

        const comment = existingResult.rows[0];

        // compara como string pra não dar problema de tipo
        if (String(comment.user_id) !== String(userId)) {
            return res.status(403).json({ error: "Você não pode apagar este comentário" });
        }

        await db.query("DELETE FROM comments WHERE id = $1", [id]);
        return res.status(204).send();
    } catch (err) {
        console.error("Erro ao deletar comentário:", err);
        res.status(500).json({ error: "Erro ao deletar comentário" });
    }
});

module.exports = router;
