const db = require('../config/db');

// Criar um novo comentário
const criar = async (req, res) => {
  const { chamado_id, mensagem } = req.body;
  
  // Tenta extrair o ID do utilizador vindo do middleware de autenticação
  const usuario_id = req.usuarioId || req.userId || (req.usuario && req.usuario.id);

  if (!mensagem || !chamado_id) {
    return res.status(400).json({ mensagem: 'Mensagem e ID do chamado são obrigatórios.' });
  }

  try {
    await db.query(
      'INSERT INTO comentarios (chamado_id, usuario_id, mensagem) VALUES (?, ?, ?)',
      [chamado_id, usuario_id, mensagem]
    );

    return res.status(201).json({ mensagem: 'Comentário adicionado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao criar comentário:', erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor ao guardar comentário.' });
  }
};

// Listar comentários de um chamado específico
const listar = async (req, res) => {
  const { chamado_id } = req.params;

  try {
    const [comentarios] = await db.query(
      `SELECT c.*, u.nome AS autor, u.tipo AS tipo_usuario 
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.chamado_id = ?
       ORDER BY c.criado_em ASC`,
      [chamado_id]
    );

    return res.json(comentarios);
  } catch (erro) {
    console.error('Erro ao listar comentários:', erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor ao procurar comentários.' });
  }
};

module.exports = {
  criar,
  listar
};