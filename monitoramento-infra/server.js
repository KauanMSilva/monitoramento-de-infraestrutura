
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', './views');

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

app.get('/visualizar', (req, res) => {
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const valores = [10, 20, 30, 40, 50, 60];
  res.render('visualizar.html', { labels: labels, valores: valores });
});

app.post('/visualizar', (req, res) => {
  console.log(req.body);
  res.send('Requisição POST recebida!');
});

app.put('/visualizar', (req, res) => {
  console.log(req.body);
  res.send('Requisição PUT recebida!');
});

app.delete('/visualizar', (req, res) => {
  console.log(req.body);
  res.send('Requisição DELETE recebida!');
});

app.get('/desempenho', async (req, res) => {
  try {
    const servidores = await Servidor.find();
    const desempenhoServidores = await Promise.all(servidores.map(async (servidor) => {
      try {
        const response = await axios.get(`http://${servidor.ip}/desempenho`);
        return { nome: servidor.nome, desempenho: response.data.desempenho };
      } catch (error) {
        return { nome: servidor.nome, desempenho: 'erro' };
      }
    }));
    res.json(desempenhoServidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter o desempenho dos servidores' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

