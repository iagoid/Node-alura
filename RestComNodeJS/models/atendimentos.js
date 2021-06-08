const moment = require('moment')
const axios = require('axios').default
const conexao = require('../infraestrutura/database/conexao')
const repositorio = require('../repositorios/atendimento')

class Atendimento {
    constructor() {
        this.dataEhValida = ({
                data,
                dataCriacao
            }) =>
            moment(data).isSameOrAfter(dataCriacao)

        this.clienteEhValido = ({
            tamanho
        }) => tamanho >= 5

        // Valida todos os erro
        // primeiro pega o nome das validações e depois o parametro passado
        // ai chama a função valido de cada campo nas validacos verificando se é diferente
        this.valida = parametros => this.validacoes.filter(
            campo => {
                const {
                    nome
                } = campo
                const parametro = parametros[nome]
                return !campo.valido(parametro)
            }
        )

        this.validacoes = [{
                nome: 'data',
                valido: this.dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]

    }

    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:MM:SS'
        )

        const parametros = {
            data: {
                data,
                dataCriacao
            },
            cliente: {
                tamanho: atendimento.cliente.length
            }
        }

        const erros = this.valida(parametros)
        const existemErros = erros.length

        if (existemErros) {
            return new Promise((resolve, reject) => reject(erros))
        } else {
            const atendimentoDatado = {
                ...atendimento,
                dataCriacao,
                data
            }

            return repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.insertId
                    return {
                        ...atendimento,
                        id
                    }
                })
        }
    }

    lista() {
        return repositorio.lista()
    }

    buscaPorId(id) {
        return repositorio.buscaPorId(id)
            .then(async resultados => {
                const atendimento = resultados[0]
                const cpf = atendimento.cliente
                const {
                    data
                } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data

                return {
                    ...atendimento
                }
            })
    }


    altera(id, atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:MM:SS'
        )

        const parametros = {
            data: {
                data,
                dataCriacao
            },
            cliente: {
                tamanho: atendimento.cliente.length
            }
        }

        const erros = this.valida(parametros)
        const existemErros = erros.length

        if (existemErros) {
            return new Promise((resolve, reject) => reject(erros))
        } else {
            const atendimentoDatado = {
                ...atendimento,
                data
            }

            return repositorio.altera(id, atendimentoDatado)
                .then(resultados => {
                    return {
                        ...atendimentoDatado,
                        id
                    }
                })
        }

    }

    deleta(id) {
        return repositorio.deleta(id)
            .then(resultados => {
                return {
                    id
                }
            })
    }
}

module.exports = new Atendimento()