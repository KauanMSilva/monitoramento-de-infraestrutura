


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');

//conectar
async function conectarMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost/monitoramento');
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

conectarMongoDB();

// aqui a gente definie o modelo de dados para os servidores
const servidorSchema = new mongoose.Schema({
  nome: String,
  ip: String,
  status: String
});

const Servidor = mongoose.model('Servidor', servidorSchema);

// aqui a gente monitorar os servidores . . 
const monitorarServidores = async () => {
  const servidores = await Servidor.find();
  servidores.forEach(servidor => {
    axios.get(`http://${servidor.ip}/status`)
      .then(response => {
        if (response.data.status === 'ok') {
          servidor.status = 'ok';
        } else {
          servidor.status = 'erro';
        }
        servidor.save();
      })
      .catch(error => {
        console.error(error);
      });
  });
};

monitorarServidores();

// aqui a gente define a rota para pegar o status dos servidores
app.get('/status', async (req, res) => {
  try {
    const servidores = await Servidor.find();
    const statusServidores = await Promise.all(servidores.map(async (servidor) => {
      try {
        const response = await axios.get(`http://${servidor.ip}/status`);
        return { nome: servidor.nome, status: response.data.status };
      } catch (error) {
        return { nome: servidor.nome, status: 'erro' };
      }
    }));
    res.json(statusServidores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter o status dos servidores' });
  }
});

// aqui ja é para definir rota para obter o desempenho dos servidores
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

app.post('/alerta', async (req, res) => {
  try {
    const { servidor, mensagem } = req.body;
    // envia um alerta para o servidor
    console.log(`Enviando alerta para o servidor ${servidor}: ${mensagem}`);
    res.json({ message: 'Alerta enviado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar alerta' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
