const mysqlPool = require('../mysql')

//RETORNA TODOS OS PRODUTOS
const buscaTodosProdutos = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'select * from produtos',
            (err, result, field) => {
                conn.release()
                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                const response = {
                    quantidadeTotalProdutos: result.length,
                    produtos: result.map(prod => {
                        return {
                            idProduto: prod.id,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem: prod.imagem,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os detalhes de um Produto específico',
                                url: 'http://localhost:3000/produtos/' + prod.id//O correto é via variável de ambiente
                            }
                        }
                    })
                }

                return res.status(200).send(response)

            })
    })
}

//RETORNA UM PRODUTO
const buscaProduto = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'select * from produtos where id = ?',
            [req.params.id],
            (err, result, field) => {
                conn.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse ID'
                    })
                }

                const response = {

                    produto: {
                        id: result[0].id,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem: result[0].imagem,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os Produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }

                return res.status(200).send(response)

            })
    })
}

//INSERE UM PRODUTO
const adicionaProduto = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'insert into produtos (nome, preco, imagem) values (?, ?, ?)',
            [req.body.nome, req.body.preco, req.file.path],
            (err, result, field) => {
                conn.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Produto inserido com Sucesso',
                    produtoCriado: {
                        id: result.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os Produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }

                return res.status(201).send(response)
            }
        )
    })

}

//ATUALIZA UM PRODUTO
const atualizaProduto = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'update produtos set nome = ?, preco = ? where id = ?',
            [req.body.nome, req.body.preco, req.params.id],
            (err, result, field) => {
                conn.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                if (result.affectedRows == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse ID'
                    })
                }

                const response = {
                    mensagem: 'Produto atualizado com Sucesso',
                    produtoAtualizado: {
                        id: req.params.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os detalhes de um Produto específico',
                            url: 'http://localhost:3000/produtos/' + req.params.id
                        }
                    }
                }

                return res.status(202).send(response)
            }
        )
    })
}

//DELETA UM PRODUTO
const deletaProduto = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'delete from produtos where id = ?',
            [req.params.id],
            (err, result, field) => {
                conn.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                if (result.affectedRows == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse ID'
                    })
                }

                const response = {
                    mensagem: 'Produto removido com Sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Float'
                        }   
                    }

                }

                return res.status(202).send(response)
            }
        )
    })

}

module.exports = {
    buscaTodosProdutos,
    buscaProduto,
    adicionaProduto,
    atualizaProduto,
    deletaProduto
}