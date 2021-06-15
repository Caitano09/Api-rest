const express = require('express')
const router = express.Router()

const login = require('../middleware/login')
const imagensController = require('../controllers/imagensController')

router.delete('/:id', login.obrigatorio, imagensController.deletaImagem)

module.exports = router