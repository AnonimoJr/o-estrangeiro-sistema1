const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// ===== CONFIG =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "pedidos.json");

// ===== CARREGAR PEDIDOS =====
let pedidos = [];
if (fs.existsSync(DATA_FILE)) {
  const data = fs.readFileSync(DATA_FILE);
  pedidos = JSON.parse(data);
}

// ===== SALVAR PEDIDOS =====
function salvarPedidos() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2));
}

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ===== PEDIDOS =====
app.post("/api/pedidos", (req, res) => {
  pedidos.push(req.body);
  salvarPedidos();
  res.json({ success: true });
});

app.get("/api/pedidos", (req, res) => {
  res.json(pedidos);
});

// ===== ROTAS FRONTEND =====
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/painel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/painel.html"));
});

// ===== TESTE =====
app.get("/api", (req, res) => {
  res.json({ status: "Backend rodando 🚀 com persistência" });
});

// ⚠️ SEMPRE ÚLTIMO
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
