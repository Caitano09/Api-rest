const mysqlPool = require('../mysql')

//RETORNA TODOS OS PEDIDOS
const buscaTodosPedidos = async (req, res, next) => {
    try {
        const query = 'select pedidos.id, pedidos.quantidade ,produtos.id as produto_id, produtos.nome, produtos.preco from pedidos join produtos on produtos.id = pedidos.produto_id'
        const result = await mysqlPool.execute(query)

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

    } catch (error) {
        return res.status(500).send({ error })
    }
}

//INSERE UM PEDIDO
const adicionaPedido = async(req, res, next) => {
    try {
        const querySelect = 'select * from produtos where id = ?'
        const resultSelect = await mysqlPool.execute(querySelect, [req.body.produto_id])    

        if (resultSelect.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado Produto com esse ID'
            })
        }

        const query = 'insert into pedidos (quantidade, produto_id) values (?, ?)'
        const result = await mysqlPool.execute(query, [req.body.quantidade, req.body.produto_id])  
        
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
    
    } catch (error) {
        return res.status(500).send({ error })      
    } 
}

//RETORNA UM PEDIDO
const buscaPedido = async(req, res, next) => {
    try {
        const query = 'select * from pedidos where id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])

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

    } catch (error) {
        return res.status(500).send({ error })       
    }    
}

//ATUALIZA UM PEDIDO
const atualizaPedido = async(req, res, next) => {
    try {
        const query = 'update pedidos set quantidade = ?, produto_id = ? where id = ?'
        const result = await mysqlPool.execute(query, [req.body.quantidade, req.body.produto_id, req.params.id])

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

    } catch (error) {
        return res.status(500).send({ error })    
    }
}

//DELETA UM PEDIDO
const deletaPedido = async(req, res, next) => {
    try {
        const query = 'delete from pedidos where id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])       
        
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

    } catch (error) {
        return res.status(500).send({ error })           
    }
}

module.exports = {
    buscaTodosPedidos,
    buscaPedido,
    adicionaPedido,
    atualizaPedido,
    deletaPedido
}