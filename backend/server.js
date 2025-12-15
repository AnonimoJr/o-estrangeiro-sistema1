const express = require("express");
const path = require("path");

const app = express();

// permite receber JSON do frontend
app.use(express.json());

// serve os arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔐 ROTA DE LOGIN (ANTES DO app.get("*"))
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// rota de teste do backend
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
