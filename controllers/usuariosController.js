const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mysqlPool = require('../mysql')

const cadastrarUsuario = async (req, res, next) => {
    try {
        const querySelect = 'select * from usuarios where email = ?'
        const resultSelect = await mysqlPool.execute(querySelect, [req.body.email])

        if (resultSelect.length > 0) {
            return res.status(409).send({ mensagem: 'Email já cadastrado' })
        }
        const hash = await bcrypt.hashSync(req.body.senha, 10/*Salt*/)

        const query = 'insert into usuarios (email, senha) values (?, ?)'
        const result = await mysqlPool.execute(query, [req.body.email, hash])

        const response = {
            mensagem: 'Usuário criado com sucesso',
            usuarioCriado: {
                id: result.insertId,
                email: req.body.email
            }
        }
        return res.status(201).send(response)

    } catch (error) {
        return res.status(500).send({ error })
    }
}

const loginUsuario = async (req, res, next) => {
    try {
        const query = 'select * from usuarios where email = ?'
        const result = await mysqlPool.execute(query, [req.body.email])

        if (result.length < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }

        const isValid = await bcrypt.compareSync(req.body.senha, result[0].senha)

        if (isValid) {
            const token = jwt.sign({
                id: result[0].id,
                email: result[0].email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            )
            return res.status(200).send({
                mensagem: 'Autenticado com Sucesso',
                token
            })
        }

        return res.status(401).send({ mensagem: 'Falha na autenticação' })

    } catch (error) {
        return res.status(500).send({ error })
    }   
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}