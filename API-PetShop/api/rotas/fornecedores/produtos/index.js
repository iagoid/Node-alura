const roteador = require('express').Router({
    mergeParams: true
})
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const roteadorReclamacoes = require('./reclamacoes')
const Serializador = require('../../../Serializador').SerializadorProduto


roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(
        res.getHeader('Content-type')
    )
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, {
            fornecedor: idFornecedor
        })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
            res.getHeader('Content-type')
        )
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        /*
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/
            produto/${produto.id}`)*/
        res.status(201).send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.delete('/:id', async (req, res) => {
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()
    res.status(200).end()
})

roteador.get('/:id', async (req, res, proxima) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados)
        await produto.carregar()
        const serializador = new Serializador(
            res.getHeader('Content-type'),
            ['preco', 'estoque', 'dataCriacao',
                'dataAtualizacao', 'versao', 'versao'
            ]
        )
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proxima(erro)
    }
})

roteador.head('/:id', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados)
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(200).end()
    } catch (erro) {
        proxima(erro)
    }
})

roteador.put('/:id', async (req, res, proximo) => {
    try {
        const dados = Object.assign({}, req.body, {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })

        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        const serializador = new Serializador(res.getHeader('Content-type'))
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(200).send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
})


roteador.options('/:id/diminuir-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.post('/:id/diminuir-estoque', async (req, res, proximo) => {
    try {
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })

        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(204).end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/estoque/reposicao', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/estoque/reposicao', async (req, res) => {
    const produtos = await Tabela.repor(req.fornecedor.id)
    const serializador = new Serializador(
        res.getHeader('Content-type'), ['estoque']
    )
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.use('/:idProduto/reclamacoes', roteadorReclamacoes)
module.exports = roteador