const roteador = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaReclamacoes')
const Reclamacao = require('./Reclamacao')

roteador.post('/', async (req, res) => {
    const idProduto = req.params.idProduto
    const corpo = req.body
    const dados = Object.assign({}, corpo, {
        produto: idProduto
    })
    const reclamacao = new Reclamacao(dados)
    await reclamacao.criar()
    res.status(201).send(
        JSON.stringify(reclamacao)
    )
})

roteador.get('/', async (req, res) => {
    const reclamacoes = await Tabela.listar(req.params.idProduto)
    res.send(
        JSON.stringify(reclamacoes)
    )
})

module.exports = roteador