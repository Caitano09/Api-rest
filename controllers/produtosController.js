const mysqlPool = require('../mysql')

const buscaTodosProdutos = async (req, res, next) => {
    try {
        let nome = ''
        if(req.query.nome){
            nome = req.query.nome
        }
        const query = `select * from produtos 
                            where categoria_id = ?
                            and nome like '%${nome}%'`/*retorna todos os valores que contém "req.query.nome"*/
        const result = await mysqlPool.execute(query, [req.query.categoria_id])

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

    } catch (error) {
        return res.status(500).send({ error })
    }  
}

const adicionaProduto = async(req, res, next) => {
    try {
        const query = 'insert into produtos (nome, preco, imagem, categoria_id) values (?, ?, ?, ?)'
        const result = await mysqlPool.execute(query, [req.body.nome, req.body.preco, req.file.path, req.body.categoria_id])

        const response = {
            mensagem: 'Produto inserido com Sucesso',
            produtoCriado: {
                id: result.insertId,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem: req.file.path,
                categoria_id: req.body.categoria_id,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os Produtos',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }

        return res.status(201).send(response)
        
    } catch (error) {
        return res.status(500).send({ error })
    }   
}

const buscaProduto = async(req, res, next) => {
    try {
        const query = 'select * from produtos where id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])

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

    } catch (error) {
        return res.status(500).send({ error })
    }   
}

const atualizaProduto = async(req, res, next) => {
    try {
        const query = 'update produtos set nome = ?, preco = ? where id = ?'
        const result = await mysqlPool.execute(query, [req.body.nome, req.body.preco, req.params.id])

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

    } catch (error) {
        return res.status(500).send({ error })
    } 
}

const deletaProduto = async(req, res, next) => {
    try {
        const query = 'delete from produtos where id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])

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

    } catch (error) {
        return res.status(500).send({ error })
    }   
}

const buscaTodasImagensProduto = async (req, res, next) => {
    try {
        const query = 'select * from imagens_produtos where produto_id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])

        const response = {
            quantidadeTotalProdutos: result.length,
            imagens: result.map(img => {
                return {
                    id_produto: img.produto_id,
                    id_imagem: img.id,
                    caminho: img.caminho,
                }
            })
        }
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error })
    }  
}

const adicionaImagemProduto = async(req, res, next) => {
    try {
        const query = 'insert into imagens_produtos (produto_id, caminho) values (?, ?)'
        const result = await mysqlPool.execute(query, [req.params.id, req.file.path])

        const response = {
            mensagem: 'Imagem inserida com Sucesso',
            ImagemCriada: {
                idProduto: req.params.id,
                idImagem: result.insertId,
                imagem: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos as imagens do Produto',
                    url: 'http://localhost:3000/produtos/'+req.params.id+'/imagem'
                }
            }
        }

        return res.status(201).send(response)
        
    } catch (error) {
        return res.status(500).send({ error })
    }   
}

module.exports = {
    buscaTodosProdutos,
    buscaProduto,
    adicionaProduto,
    atualizaProduto,
    deletaProduto,
    buscaTodasImagensProduto,
    adicionaImagemProduto
}