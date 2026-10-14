const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de novos utilizadores
const cadastrar = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Verificar se o e-mail já está registado
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length > 0) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir o utilizador na base de dados
    await db.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo || 'cliente']
    );

    return res.status(201).json({ mensagem: 'Utilizador cadastrado com sucesso!' });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// Login de utilizadores
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  try {
    // Procurar utilizador pelo e-mail
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = usuarios[0];

    // Verificar se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET || 'chave_secreta_padrao',
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// Exportar explicitamente as duas funções
module.exports = {
  cadastrar,
  login
};