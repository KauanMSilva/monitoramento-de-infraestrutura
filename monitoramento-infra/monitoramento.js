const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const Chart = require('chart.js');

// conecta o MongoDB
async function conectarMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost/monitoramento');
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

conectarMongoDB();

// aqui define o modelo de dados para os servidores
const servidorSchema = new mongoose.Schema({
  nome: String,
  ip: String,
  status: String
});

const Servidor = mongoose.model('Servidor', servidorSchema);

// monitora os servidores
const monitorarServidores = async () => {
    const servidores = await Servidor.find();
    for (const servidor of servidores) {
      try {
        const response = await axios.get(`http://${servidor.ip}/status`);
        if (response.data.status === 'ok') {
          servidor.status = 'ok';
        } else {
          servidor.status = 'erro';
        }
        await servidor.save();
      } catch (error) {
        console.error(error);
      }
    }
  };
  

// aqui ja define  a rota para visualizar os dados
app.get('/visualizar', async (req, res) => {
    try {
      const servidores = await Servidor.find();
      const dados = await Promise.all(servidores.map(async (servidor) => {
        try {
          const response = await axios.get(`http://${servidor.ip}/desempenho`);
          if (response.data && response.data.desempenho) {
            return { nome: servidor.nome, desempenho: response.data.desempenho };
          } else {
            return { nome: servidor.nome, desempenho: 'erro' };
          }
        } catch (error) {
          console.error(error);
          return { nome: servidor.nome, desempenho: 'erro' };
        }
      }));
      const labels = dados.map(dado => dado.nome);
      const valores = dados.map(dado => dado.desempenho);
      res.render('visualizar', { labels, valores });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao visualizar os dados' });
    }
  });
  

    const labels = dados.map(dado => dado.nome);
    const valores = dados.map(dado => dado.desempenho);

    app.get('/visualizar', async (req, res) => {
        try {
          const servidores = await Servidor.find();
          const dados = await Promise.all(servidores.map(async (servidor) => {
            try {
              const response = await axios.get(`http://${servidor.ip}/desempenho`);
              if (response.data && response.data.desempenho) {
                return { nome: servidor.nome, desempenho: response.data.desempenho };
              } else {
                return { nome: servidor.nome, desempenho: 'erro' };
              }
            } catch (error) {
              console.error(error);
              return { nome: servidor.nome, desempenho: 'erro' };
            }
          }));
          const labels = dados.map(dado => dado.nome);
          const valores = dados.map(dado => dado.desempenho);
          res.render('visualizar', { labels, valores });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao visualizar os dados' });
        }
      });
      