const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Verifique se a rota é POST / ou POST /:chamadoId
router.post('/', authMiddleware, comentarioController.criar);
router.get('/:chamado_id', authMiddleware, comentarioController.listar);

module.exports = router;