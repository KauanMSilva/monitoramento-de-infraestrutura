const express = require('express');
const app = express();
const mongoose = require('mongoose');

async function conectarMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost/monitoramento');
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

conectarMongoDB();

app.use(express.json());

app.get('/status', (req, res) => {
  // Lógica para obter o status dos servidores, bancos de dados e redes
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
