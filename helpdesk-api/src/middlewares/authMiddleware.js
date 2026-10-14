const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Formato esperado: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Injeta os dados do utilizador logado na requisição (req)
    next(); // Permite prosseguir para o controller
  } catch (erro) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};