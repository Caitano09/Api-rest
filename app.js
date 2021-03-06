const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 3000
const morgan = require('morgan')

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')
const rotaUsuarios = require('./routes/usuarios')
const rotaImagens = require('./routes/imagens')
const rotaCategorias = require('./routes/categorias')


app.use(morgan('dev'))
app.use("/uploads", express.static('uploads'))

app.use(express.urlencoded({ extended: true}))// "extended: false" = apenas dados simples
app.use(express.json())//json de entrada no body

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')//No lugar da "*" poderia ser um servidor especifico "http://servidorEspecifico.com"
    res.header(
        'Access-Control-Allow-Header', 
        'Origin','Content-Type', 'X-Requested-With', 'Accept', 'Authorization'
        )

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
        return res.status(200).send({})
    }

    next()
})

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)
app.use('/usuarios', rotaUsuarios)
app.use('/imagens', rotaImagens)
app.use('/categorias', rotaCategorias)

app.use((req, res, next)=>{
    const erro = new Error('Não Encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem: error.message
        }
    })
})

http.listen(port, () => console.log('listening on port: ', port))