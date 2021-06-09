const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteadorv2 = require('./rotas/fornecedores/rotas.v2')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((req, res, proximo) => {
    res.set('X-Powered-By', 'Iago Ivanir Dalmolin')

    let formatoRequisitado = req.header('Accept')

    if(formatoRequisitado === '*/*'){
        formatoRequisitado = 'application/json'
    }

    if(formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-type',formatoRequisitado)
    proximo()
})

// Define uais sites podem acessar a API
// Devemos colar a url do site ou um *(todo os sites)
app.use((req, res, proximo) => {
    res.set('Access-Control-Allow-Origin', '*')
    proximo()
})

app.use('/api/fornecedores', roteador)

app.use('/api/v2/fornecedores', roteadorv2)

app.use((erro, req, res, proximo) => {
    let status = 500

    if (erro instanceof NaoEncontrado) {
        status = 404
    } else if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    } else if (erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )
    res.status(status).send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )

})

app.listen(config.get('api.porta'), () => console.log("Rodando na porta", config.get('api.porta')))