// server/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    // tenta header Bearer
    const h = req.headers.authorization;
    let token = (h && h.startsWith("Bearer ")) ? h.split(" ")[1] : null;

    // se não vier no header, usa cookie "token"
    if (!token && req.cookies) token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Token não enviado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido" });
    }
};
