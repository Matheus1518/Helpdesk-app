const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Se colocar '/cadastrar', a URL final será http://localhost:3000/api/auth/cadastrar
router.post('/cadastrar', authController.cadastrar);

// Rota de login
router.post('/login', authController.login);

module.exports = router;