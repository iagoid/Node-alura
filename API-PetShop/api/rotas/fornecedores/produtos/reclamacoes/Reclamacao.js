const Tabela = require('./TabelaReclamacoes')

class Reclamacao {
    constructor({
        id,
        reclamacao,
        produto,
        dataCriacao,
        dataAtualizacao,
        versao
    }) {
        this.id = id
        this.reclamacao = reclamacao
        this.produto = produto
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }


    async criar() {
        const resultado = await Tabela.inserir({
            reclamacao: this.reclamacao,
            produto: this.produto,
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }
}

module.exports = Reclamacao