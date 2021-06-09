const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const roteadorProdutos = require('./produtos')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

// Mostra quais os protocolos disponiveis para essa rota
// Isso me permite ir no navegador
// const cabecalhos = {'Content-Type': 'application/json'}
// fetch('http://localhost:3000/api/fornecedores/11', { method: 'PUT', body: JSON.stringify({empresa: 'Hello'}), headers: cabecalhos }).then(console.log)
roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'), ['categoria', 'empresa']
    )
    res.status(200).send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'), ['categoria', 'empresa']
        )
        res.status(201).send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({
            id: id
        })
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['categoria', 'empresa', 'email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.status(200).send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})


roteador.put('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {
            id: id
        })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()

        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),['categoria', 'empresa']
        )
        res.status(200).send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({
            id: id
        })
        await fornecedor.deletar()
        res.status(204).end()
    } catch (erro) {
        proximo(erro)
    }
})

const verificarFornecedor = async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({
            id: id
        })
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        proximo()
    } catch (erro) {
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)
module.exports = roteador