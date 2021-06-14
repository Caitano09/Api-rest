const express = require('express')
const router = express.Router()
const multer = require('multer')

const login = require('../middleware/login')
const produtosController = require('../controllers/produtosController')


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, Date.now().toString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false) 
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 100//valor em bytes
    },
    fileFilter
})

router.get('/', produtosController.buscaTodosProdutos)

router.post('/', login.obrigatorio, upload.single('imagem'), produtosController.adicionaProduto)

router.get('/:id', produtosController.buscaProduto)

router.put('/:id', login.obrigatorio, upload.single('imagem'), produtosController.atualizaProduto)

router.delete('/:id', login.obrigatorio, produtosController.deletaProduto)

module.exports = router