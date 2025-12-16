const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "pedidos.json");

// 🔐 DADOS PIX (EDITE APENAS AQUI)
const PIX_CHAVE = "08909511958";
const PIX_NOME = "O Estrangeiro Delivery";
const PIX_CIDADE = "Apucarana";

// ===== CARREGAR PEDIDOS =====
let pedidos = [];
if (fs.existsSync(DATA_FILE)) {
  pedidos = JSON.parse(fs.readFileSync(DATA_FILE));
}

function salvar() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2));
}

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  res.json({ success: user === "admin" && pass === "1234" });
});

// ===== PEDIDO SITE =====
app.post("/api/pedidos", (req, res) => {
  const pedido = {
    ...req.body,
    status: "Aguardando pagamento",
    pix: {
      chave: PIX_CHAVE,
      nome: PIX_NOME,
      cidade: PIX_CIDADE
    },
    origem: "site"
  };
  pedidos.push(pedido);
  salvar();
  res.json(pedido);
});

// ===== WHATSAPP SIMULADO =====
app.post("/api/whatsapp", (req, res) => {
  const pedido = {
    nome: "Cliente WhatsApp",
    telefone: req.body.telefone,
    pedido: req.body.mensagem,
    data: new Date().toLocaleString(),
    status: "Aguardando pagamento",
    pix: {
      chave: PIX_CHAVE,
      nome: PIX_NOME,
      cidade: PIX_CIDADE
    },
    origem: "whatsapp"
  };
  pedidos.push(pedido);
  salvar();
  res.json({ ok: true });
});

// ===== LISTAR =====
app.get("/api/pedidos", (req, res) => res.json(pedidos));

// ===== PAGAR =====
app.post("/api/pagar", (req, res) => {
  const { index } = req.body;
  if (pedidos[index]) {
    pedidos[index].status = "Pago";
    salvar();
  }
  res.json({ ok: true });
});

// ===== ROTAS =====
["login", "pedido", "painel"].forEach(p =>
  app.get(`/${p}.html`, (req, res) =>
    res.sendFile(path.join(__dirname, `../frontend/${p}.html`))
  )
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor com Pix REAL rodando 🚀")
);
