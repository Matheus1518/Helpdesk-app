const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', chamadoController.listarChamados);
router.post('/', chamadoController.criarChamado);
router.put('/:id', chamadoController.atualizarChamado);

module.exports = router;