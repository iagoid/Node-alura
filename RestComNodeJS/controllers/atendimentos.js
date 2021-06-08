const Atendimento = require('../models/atendimentos')

module.exports = app => {
    app.get('/atendimentos', (req, res) => {
        Atendimento.lista()
            .then(resultados => res.json(resultados))
            .catch(erros => res.status(400).json(erros))
    })

    app.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Atendimento.buscaPorId(id)
            .then(resultados => res.json(resultados))
            .catch(erros => res.status(400).json(erros))
    })

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body
        Atendimento.adiciona(atendimento)
            .then(atendimentoCadastrado => res.status(201).json(atendimentoCadastrado))
            .catch(erros => res.status(400).json(erros))
    })

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const atendimento = req.body
        Atendimento.altera(id, atendimento)
            .then(atendimentoAlterado => res.status(200).json(atendimentoAlterado))
            .catch(erros => res.status(400).json(erros))
    })

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Atendimento.deleta(id)
            .then(resultados => res.status(200).json(resultados))
            .catch(erros => res.status(400).json(erros))
    })
}