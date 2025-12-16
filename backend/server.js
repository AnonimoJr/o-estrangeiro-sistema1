const express = require("express");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "pedidos.json");

// 🔐 DADOS PIX (EDITE AQUI)
const PIX_CHAVE = "08909511958";
const PIX_NOME = "Sidnei Aparecido Paiva Junior";
const PIX_CIDADE = "Apucarana";

// ===== PEDIDOS =====
let pedidos = [];
if (fs.existsSync(DATA_FILE)) {
  pedidos = JSON.parse(fs.readFileSync(DATA_FILE));
}

function salvar() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2));
}

// ===== PEDIDO =====
app.post("/api/pedidos", async (req, res) => {
  const textoPix = `PIX|${PIX_CHAVE}|${PIX_NOME}|${PIX_CIDADE}`;

  const qrCode = await QRCode.toDataURL(textoPix);

  const pedido = {
    ...req.body,
    status: "Aguardando pagamento",
    pix: {
      chave: PIX_CHAVE,
      nome: PIX_NOME,
      cidade: PIX_CIDADE,
      qrcode: qrCode
    }
  };

  pedidos.push(pedido);
  salvar();
  res.json(pedido);
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
["pedido", "painel"].forEach(p =>
  app.get(`/${p}.html`, (req, res) =>
    res.sendFile(path.join(__dirname, `../frontend/${p}.html`))
  )
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Servidor com QR Code Pix rodando 🚀")
);
