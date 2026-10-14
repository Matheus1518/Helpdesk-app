const pool = require('../config/db');

// Listar chamados (Clientes veem os seus; Técnicos veem todos)
exports.listarChamados = async (req, res) => {
  try {
    const { id, tipo } = req.usuario;
    let query = `
      SELECT c.id, c.titulo, c.descricao, c.categoria, c.prioridade, c.status,
             u_cli.nome AS cliente, COALESCE(u_tec.nome, 'Não atribuído') AS tecnico,
             c.criado_em
      FROM chamados c
      INNER JOIN usuarios u_cli ON c.cliente_id = u_cli.id
      LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
    `;
    const params = [];

    if (tipo === 'cliente') {
      query += ' WHERE c.cliente_id = ?';
      params.push(id);
    }

    query += ' ORDER BY c.criado_em DESC';

    const [chamados] = await pool.query(query, params);
    res.json(chamados);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar chamados', erro: erro.message });
  }
};

// Criar um novo chamado
exports.criarChamado = async (req, res) => {
  const { titulo, descricao, categoria, prioridade } = req.body;
  const cliente_id = req.usuario.id;

  if (!titulo || !descricao || !categoria) {
    return res.status(400).json({ mensagem: 'Título, descrição e categoria são obrigatórios.' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO chamados (titulo, descricao, categoria, prioridade, cliente_id) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, categoria, prioridade || 'media', cliente_id]
    );

    res.status(201).json({
      mensagem: 'Chamado aberto com sucesso!',
      chamadoId: resultado.insertId
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar chamado', erro: erro.message });
  }
};

// Atualizar status / Atribuir técnico
exports.atualizarChamado = async (req, res) => {
  const { id } = req.params;
  const { status, tecnico_id } = req.body;

  try {
    const [chamado] = await pool.query('SELECT * FROM chamados WHERE id = ?', [id]);
    if (chamado.length === 0) {
      return res.status(404).json({ mensagem: 'Chamado não encontrado.' });
    }

    await pool.query(
      'UPDATE chamados SET status = COALESCE(?, status), tecnico_id = COALESCE(?, tecnico_id) WHERE id = ?',
      [status, tecnico_id, id]
    );

    res.json({ mensagem: 'Chamado atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado', erro: erro.message });
  }
};

// Adicionar comentário ao chamado
exports.adicionarComentario = async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;
  const usuario_id = req.usuario.id;

  if (!mensagem) {
    return res.status(400).json({ mensagem: 'A mensagem do comentário não pode estar vazia.' });
  }

  try {
    await pool.query(
      'INSERT INTO comentarios (chamado_id, usuario_id, mensagem) VALUES (?, ?, ?)',
      [id, usuario_id, mensagem]
    );

    res.status(201).json({ mensagem: 'Comentário adicionado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao adicionar comentário', erro: erro.message });
  }
};

// Listar histórico de comentários de um chamado
exports.listarComentarios = async (req, res) => {
  const { id } = req.params;

  try {
    const [comentarios] = await pool.query(
      `SELECT com.id, u.nome AS autor, u.tipo AS tipo_usuario, com.mensagem, com.criado_em
       FROM comentarios com
       INNER JOIN usuarios u ON com.usuario_id = u.id
       WHERE com.chamado_id = ?
       ORDER BY com.criado_em ASC`,
      [id]
    );

    res.json(comentarios);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar comentários', erro: erro.message });
  }
};