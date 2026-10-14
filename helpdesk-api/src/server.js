const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Registar os prefixos das rotas
app.use('/api/auth', authRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use('/api/comentarios', comentarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});