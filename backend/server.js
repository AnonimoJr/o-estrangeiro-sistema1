const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "pedidos.json");

// ===== CARREGAR PEDIDOS =====
let pedidos = [];
if (fs.existsSync(DATA_FILE)) {
  pedidos = JSON.parse(fs.readFileSync(DATA_FILE));
}

// ===== SALVAR =====
function salvar() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2));
}

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  res.json({ success: user === "admin" && pass === "1234" });
});

// ===== CRIAR PEDIDO (SITE) =====
app.post("/api/pedidos", (req, res) => {
  const pedido = {
    ...req.body,
    status: "Aguardando pagamento",
    pix: "00020126360014BR.GOV.BCB.PIX0114+559999999999520400005303986540510.005802BR5920O ESTRANGEIRO6009SAO PAULO62070503***",
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
    pix: "00020126360014BR.GOV.BCB.PIX0114+559999999999520400005303986540510.005802BR5920O ESTRANGEIRO6009SAO PAULO62070503***",
    origem: "whatsapp"
  };
  pedidos.push(pedido);
  salvar();
  res.json({ ok: true });
});

// ===== LISTAR PEDIDOS =====
app.get("/api/pedidos", (req, res) => {
  res.json(pedidos);
});

// ===== MARCAR COMO PAGO =====
app.post("/api/pagar", (req, res) => {
  const { index } = req.body;
  if (pedidos[index]) {
    pedidos[index].status = "Pago";
    salvar();
  }
  res.json({ ok: true });
});

// ===== ROTAS =====
app.get("/painel.html", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/painel.html"))
);

app.get("/pedido.html", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/pedido.html"))
);

app.get("/login.html", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/login.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor com Pix rodando 🚀")
);
