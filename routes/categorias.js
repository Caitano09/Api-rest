const express = require('express')
const router = express.Router()

const login = require('../middleware/login')
const categoriasController = require('../controllers/categoriasController')

router.get('/', categoriasController.buscaTodasCategorias)
router.post('/', login.obrigatorio, categoriasController.adicionaCategoria)

module.exports = router