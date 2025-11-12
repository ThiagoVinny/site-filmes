require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const foldersRoutes = require("./routes/folders");

const app = express();

// 🌐 Configuração de CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// 👋 Rota de teste
app.get("/", (req, res) => {
    res.json({ ok: true, message: "🎬 API Cinefy rodando com sucesso!" });
});

// 📁 Rotas principais (SEM /api/)
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/folders", foldersRoutes);

// 🧯 Handler de erro global
app.use((err, req, res, next) => {
    console.error("❌ Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
});

// 🚀 Inicialização
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API Cinefy rodando na porta ${PORT}`));
