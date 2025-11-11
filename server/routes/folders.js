const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, name, description, created_at FROM folders WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Erro em GET /folders", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

        const result = await db.query(
            "INSERT INTO folders (user_id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description, created_at",
            [req.userId, name, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro em POST /folders", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM folders WHERE id = $1 AND user_id = $2",
            [id, req.userId]
        );

        res.status(204).send();
    } catch (err) {
        console.error("Erro em DELETE /folders/:id", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

router.post("/:id/series", auth, async (req, res) => {
    try {
        const { id } = req.params; // folder_id
        const { tmdb_id, media_type } = req.body;

        if (!tmdb_id) return res.status(400).json({ error: "tmdb_id é obrigatório" });

        // Garante que a pasta é do usuário
        const folder = await db.query(
            "SELECT id FROM folders WHERE id = $1 AND user_id = $2",
            [id, req.userId]
        );
        if (folder.rows.length === 0)
            return res.status(404).json({ error: "Pasta não encontrada" });

        await db.query(
            `INSERT INTO folder_series (folder_id, tmdb_id, media_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (folder_id, tmdb_id) DO NOTHING`,
            [id, tmdb_id, media_type || "tv"]
        );

        res.status(201).json({ ok: true });
    } catch (err) {
        console.error("Erro em POST /folders/:id/series", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

router.get("/:id/series", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "SELECT tmdb_id, media_type, added_at FROM folder_series WHERE folder_id = $1",
            [id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Erro em GET /folders/:id/series", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

module.exports = router;
