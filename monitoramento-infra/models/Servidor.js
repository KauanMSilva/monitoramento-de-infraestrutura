const mongoose = require('mongoose');

const servidorSchema = new mongoose.Schema({
  nome: String,
  ip: String,
  status: String
});

const Servidor = mongoose.model('Servidor', servidorSchema);

module.exports = Servidor;
