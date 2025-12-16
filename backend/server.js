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
  pedidos = JSON.parse(fs.readFileSync(DATA_FILE));
}

// ===== SALVAR =====
function salvarPedidos() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2));
}

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  res.json({ success: user === "admin" && pass === "1234" });
});

// ===== PEDIDOS =====
app.post("/api/pedidos", (req, res) => {
  pedidos.push({ ...req.body, origem: "site" });
  salvarPedidos();
  res.json({ success: true });
});

app.get("/api/pedidos", (req, res) => {
  res.json(pedidos);
});

// ===== WHATSAPP SIMULADO =====
app.post("/api/whatsapp", (req, res) => {
  const { telefone, mensagem } = req.body;

  pedidos.push({
    nome: "Cliente WhatsApp",
    telefone,
    pedido: mensagem,
    data: new Date().toLocaleString(),
    origem: "whatsapp"
  });

  salvarPedidos();
  res.json({ status: "Mensagem recebida e pedido criado" });
});

// ===== ROTAS FRONTEND =====
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/painel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/painel.html"));
});

app.get("/pedido.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pedido.html"));
});

// ===== TESTE =====
app.get("/api", (req, res) => {
  res.json({ status: "Sistema online com WhatsApp simulado 🚀" });
});

// ⚠️ SEMPRE ÚLTIMO
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
