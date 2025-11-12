const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/folders
 * Lista todas as pastas do usuário logado
 */
router.get("/", auth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, description, created_at
       FROM folders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Erro em GET /folders:", err);
        res.status(500).json({ error: "Erro interno ao buscar pastas" });
    }
});

/**
 * POST /api/folders
 * Cria uma nova pasta
 */
router.post("/", auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

        const result = await db.query(
            `INSERT INTO folders (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_at`,
            [req.userId, name, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Erro em POST /folders:", err);
        res.status(500).json({ error: "Erro interno ao criar pasta" });
    }
});

/**
 * DELETE /api/folders/:id
 * Exclui uma pasta do usuário
 */
router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, req.userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Pasta não encontrada" });
        }

        res.status(204).send();
    } catch (err) {
        console.error("❌ Erro em DELETE /folders/:id:", err);
        res.status(500).json({ error: "Erro interno ao excluir pasta" });
    }
});

/**
 * POST /api/folders/:id/series
 * Adiciona uma série a uma pasta
 */
// server/routes/folders.js
router.post("/:id/add", auth, async (req, res) => {
    try {
        const { id } = req.params; // folder_id
        const { tmdb_id, media_type } = req.body;

        console.log("=== DEBUG ADD ===");
        console.log("req.userId:", req.userId);
        console.log("folder id:", id);
        console.log("body:", req.body);

        if (!tmdb_id) return res.status(400).json({ error: "tmdb_id é obrigatório" });

        const folder = await db.query(
            "SELECT id FROM folders WHERE id = $1 AND user_id = $2",
            [id, req.userId]
        );
        if (folder.rows.length === 0)
            return res.status(404).json({ error: "Pasta não encontrada ou não pertence ao usuário" });

        await db.query(
            `INSERT INTO folder_series (folder_id, tmdb_id, media_type)
             VALUES ($1, $2, $3)
                 ON CONFLICT (folder_id, tmdb_id) DO NOTHING`,
            [id, tmdb_id, media_type || "tv"]
        );

        res.status(201).json({ ok: true });
    } catch (err) {
        console.error("Erro em POST /folders/:id/add:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * 🔁 Alias adicional (compatível com o front atual)
 * POST /api/folders/:id/add → mesmo comportamento de /:id/series
 */
router.post("/:id/add", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { tmdb_id, media_type } = req.body;

        if (!tmdb_id) return res.status(400).json({ error: "tmdb_id é obrigatório" });

        const folder = await db.query(
            "SELECT id FROM folders WHERE id = $1 AND user_id = $2",
            [id, req.userId]
        );
        if (folder.rows.length === 0) {
            return res.status(404).json({ error: "Pasta não encontrada ou sem permissão" });
        }

        await db.query(
            `INSERT INTO folder_series (folder_id, tmdb_id, media_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (folder_id, tmdb_id) DO NOTHING`,
            [id, tmdb_id, media_type || "tv"]
        );

        res.status(201).json({ ok: true, message: "Série adicionada à pasta com sucesso" });
    } catch (err) {
        console.error("❌ Erro em POST /folders/:id/add:", err);
        res.status(500).json({ error: "Erro interno ao adicionar série" });
    }
});

/**
 * GET /api/folders/:id/series
 * Lista todas as séries de uma pasta
 */
router.get("/:id/series", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT tmdb_id, media_type, added_at
       FROM folder_series
       WHERE folder_id = $1
       ORDER BY added_at DESC`,
            [id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Erro em GET /folders/:id/series:", err);
        res.status(500).json({ error: "Erro interno ao buscar séries da pasta" });
    }
});

module.exports = router;
