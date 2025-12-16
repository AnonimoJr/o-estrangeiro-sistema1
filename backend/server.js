const express = require("express");
const path = require("path");

const app = express();

// permitir JSON
app.use(express.json());

// servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ===== PEDIDOS (em memória) =====
let pedidos = [];

app.post("/api/pedidos", (req, res) => {
  pedidos.push(req.body);
  res.json({ success: true });
});

app.get("/api/pedidos", (req, res) => {
  res.json(pedidos);
});

// ===== ROTAS FRONTEND FORÇADAS =====
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/painel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/painel.html"));
});

// ===== TESTE BACKEND =====
app.get("/api", (req, res) => {
  res.json({ status: "Backend rodando 🚀" });
});

// ⚠️ SEMPRE POR ÚLTIMO
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
