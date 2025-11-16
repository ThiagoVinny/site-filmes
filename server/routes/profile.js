const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT user_id, display_name, bio, filmes_count, este_ano_count, seguidores_count, seguindo_count FROM profiles WHERE user_id = $1",
            [req.userId]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Perfil não encontrado" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro em /profile/me", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

// Atualizar nome/bio
router.put("/me", auth, async (req, res) => {
    try {
        const { display_name, bio } = req.body;

        const result = await db.query(
            `UPDATE profiles
       SET display_name = COALESCE($1, display_name),
           bio = COALESCE($2, bio)
       WHERE user_id = $3
       RETURNING user_id, display_name, bio, filmes_count, este_ano_count, seguidores_count, seguindo_count`,
            [display_name, bio, req.userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro em /profile/me PUT", err);
        res.status(500).json({ error: "Erro interno" });
    }
});

module.exports = router;
