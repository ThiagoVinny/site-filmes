// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const foldersRoutes = require("./routes/folders");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ ok: true, message: "API Site Filmes" });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/folders", foldersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
