const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mysqlPool = require('../mysql')

const cadastrarUsuario = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query('select * from usuarios where email = ?', [req.body.email], (err, results) => {
            if (err) {
                return res.status(500).send({
                    error: err,
                    response: null
                })
            }
            if (results.length > 0) {
                return res.status(409).send({ mensagem: 'Email já cadastrado' })
            } else {
                bcrypt.hash(req.body.senha, 10/*Salt*/, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt,
                            response: null
                        })
                    }
                    conn.query('insert into usuarios (email, senha) values (?, ?)',
                        [req.body.email, hash],
                        (err, result) => {
                            conn.release()
                            if (err) {
                                return res.status(500).send({
                                    error: err,
                                    response: null
                                })
                            }
                            const response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id: result.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response)
                        }
                    )
                })
            }
        })

    })
}

const loginUsuario = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query('select * from usuarios where email = ?', [req.body.email], (err, results) => {
            conn.release()
            if (err) {
                return res.status(500).send({
                    error: err,
                    response: null
                })
            }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            }
            bcrypt.compare(req.body.senha, results[0].senha, (errBcrypt, senha) =>{
                if(errBcrypt){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' }) 
                }
                if(senha){
                    const token = jwt.sign({
                        id: results[0].id,
                        email: results[0].email
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    )
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com Sucesso' ,
                        token
                    }) 
                }

                return res.status(401).send({ mensagem: 'Falha na autenticação' }) 
            })
        })
    })
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}