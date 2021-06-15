const mysqlPool = require('../mysql')

const deletaImagem = async (req, res, next) => {
    try {
        const query = 'delete from imagens_produtos where id = ?'
        const result = await mysqlPool.execute(query, [req.params.id])

        if (result.affectedRows == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrada imagem com esse ID'
            })
        }

        const response = {
            mensagem: 'Imagem removida com Sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um Produto',
                url: 'http://localhost:3000/produtos/'+req.body.produto_id+'/imagem',
                body: {
                    id_Produto: 'Int',
                    imagem: 'File'
                }
            }

        }

        return res.status(202).send(response)

    } catch (error) {
        return res.status(500).send({ error })
    }
}

module.exports ={
    deletaImagem
}