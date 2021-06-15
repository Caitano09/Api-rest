const mysqlPool = require('../mysql')

const buscaTodasCategorias = async (req, res, next) => {
    try {
        const query = 'select * from categorias'
        const result = await mysqlPool.execute(query)

        const response = {
            quantidadeTotalCategorias: result.length,
            categorias: result.map(cat => {
                return {
                    id: cat.id,
                    nome: cat.nome,
                }
            })
        }
        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error })
    }  
}

const adicionaCategoria = async(req, res, next) => {
    try {
        const query = 'insert into categorias (nome) values (?)'
        const result = await mysqlPool.execute(query, [req.body.nome])

        const response = {
            mensagem: 'Categoria inserida com Sucesso',
            CategoriaCriada: {
                id: result.insertId,
                nome: req.body.nome,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos as Categorias',
                    url: 'http://localhost:3000/Categorias'
                }
            }
        }

        return res.status(201).send(response)
        
    } catch (error) {
        return res.status(500).send({ error })
    }   
}

module.exports = {
    buscaTodasCategorias,
    adicionaCategoria
}