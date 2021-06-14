const jwt = require('jsonwebtoken')

exports.obrigatorio = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)    
        req.usuario = decode//adiciona o decode ao "req.usuario" criado agora *Comentário com base na observação*
        next()   
    } catch (error) {
        return res.status(401).send({mensagem: 'Falha na verificação da autenticação'})
    }
}

exports.opcional = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)    
        req.usuario = decode
        next()   
    } catch (error) {
        next()
    }
}