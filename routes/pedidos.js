const express = require('express')
const router = express.Router()

const pedidosController = require('../controllers/pedidosController')

router.get('/', pedidosController.buscaTodosPedidos)

router.post('/', pedidosController.adicionaPedido)

router.get('/:id', pedidosController.buscaPedido)

router.put('/:id', pedidosController.atualizaPedido)

router.delete('/:id', pedidosController.deletaPedido)

module.exports = router