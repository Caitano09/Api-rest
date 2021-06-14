const mysqlPool = require('../mysql')

//RETORNA TODOS OS PRODUTOS
const buscaTodosPedidos = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'select pedidos.id, pedidos.quantidade ,produtos.id as produto_id, produtos.nome, produtos.preco from pedidos join produtos on produtos.id = pedidos.produto_id;',
            (err, result, field) => {
                conn.release()
                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                const response = {
                    quantidadeTotalPedidos: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            idPedido: pedido.id,
                            quantidade: pedido.quantidade,
                            produto: {
                                produto_id: pedido.produto_id,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os detalhes de um pedido específico',
                                url: 'http://localhost:3000/pedidos/' + pedido.id//O correto é via variável de ambiente
                            }
                        }
                    })
                }

                return res.status(200).send(response)

            })
    })
}

//RETORNA UM PRODUTO
const buscaPedido = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'select * from pedidos where id = ?',
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
                        mensagem: 'Não foi encontrado pedido com esse ID'
                    })
                }

                const response = {

                    pedido: {
                        id: result[0].id,
                        quantidade: result[0].quantidade,
                        produto_id: result[0].produto_id,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(200).send(response)

            })
    })
}

//INSERE UM PRODUTO
const adicionaPedido = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query("select * from produtos where id = ?",/*Há um erro quando se insere um "produto_id" invalido e depois um válido */
            [req.body.produto_id],
            (err, result, field) => {
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado Produto com esse ID'
                    })
                }
            })

        conn.query(
            'insert into pedidos (quantidade, produto_id) values (?, ?)',
            [req.body.quantidade, req.body.produto_id],
            (err, result, field) => {
                conn.release()

                if (err) {
                    return res.status(500).send({
                        error: err,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'pedido inserido com Sucesso',
                    pedidoCriado: {
                        id: result.insertId,
                        quantidade: req.body.quantidade,
                        produto_id: req.body.produto_id,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(201).send(response)
            }
        )
    })

}

//ATUALIZA UM PRODUTO
const atualizaPedido = (req, res, next) => {
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'update pedidos set quantidade = ?, produto_id = ? where id = ?',
            [req.body.quantidade, req.body.produto_id, req.params.id],
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
                        mensagem: 'Não foi encontrado pedido com esse ID'
                    })
                }

                const response = {
                    mensagem: 'pedido atualizado com Sucesso',
                    pedidoAtualizado: {
                        id: req.params.id,
                        quantidade: req.body.quantidade,
                        produto_id: req.body.produto_id,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os detalhes de um pedido específico',
                            url: 'http://localhost:3000/pedidos/' + req.params.id
                        }
                    }
                }

                return res.status(202).send(response)
            }
        )
    })
}

//DELETA UM PRODUTO
const deletaPedido = (req, res, next) =>{
    mysqlPool.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            })
        }
        conn.query(
            'delete from pedidos where id = ?',
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
                        mensagem: 'Não foi encontrado pedido com esse ID'
                    })
                }

                const response = {
                    mensagem: 'pedido removido com Sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            quantidade: 'String',
                            produto_id: 'Float'
                        }
                    }

                }

                return res.status(202).send(response)
            }
        )
    })
}

module.exports = {
    buscaTodosPedidos,
    buscaPedido,
    adicionaPedido,
    atualizaPedido,
    deletaPedido
}