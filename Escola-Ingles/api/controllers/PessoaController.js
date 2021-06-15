const database = require('../models')

class PessoaController {
    static async pegaTodasAsPessoas(req, res) {
        try {
            const todasAsPessoas = await database.Pessoas.findAll()
            return res.status(200).json(todasAsPessoas)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async pegaUmaPessoa(req, res) {
        const {
            id
        } = req.params
        try {
            const umaPessoa = await database.Pessoas.findOne({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(umaPessoa)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async criaPessoa(req, res) {
        const novaPessoa = req.body
        try {
            const novaPessoaCriada = await database.Pessoas.create(novaPessoa)
            return res.status(200).json(novaPessoaCriada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async editaPessoa(req, res) {
        const pessoa = req.body
        const {
            id
        } = req.params
        try {
            await database.Pessoas.update(pessoa, {
                where: {
                    id: Number(id)
                }
            })

            const pessoaAtualizada = await database.Pessoas.findOne({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(pessoaAtualizada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async deletaPessoa(req, res) {
        const {
            id
        } = req.params
        try {
            await database.Pessoas.destroy({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).end()
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }


    static async pegaUmaMatricula(req, res) {
        const {
            estudanteId,
            matriculaId
        } = req.params
        try {
            const umaMatricula = await database.Matriculas.findOne({
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            })
            return res.status(200).json(umaMatricula)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async criaMatricula(req, res) {
        const {
            estudanteId
        } = req.params
        const novaMatricula = {
            ...req.body,
            estudante_id: Number(estudanteId)
        }
        try {
            const novaMatriculaCriada = await database.Matriculas.create(novaMatricula)
            return res.status(200).json(novaMatriculaCriada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }


    static async atualizaMatricula(req, res) {
        const {
            estudanteId,
            matriculaId
        } = req.params
        const dadosAtualizar = {
            ...req.body,
            estudante_id: Number(estudanteId)
        }
        try {
            await database.Matriculas.update(dadosAtualizar, {
                where: {
                    id: Number(matriculaId)
                }
            })
            const MatriculaAtualizada = await database.Matriculas.findOne({
                where: {
                    id: Number(matriculaId)
                }
            })
            return res.status(200).json(MatriculaAtualizada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async deletaMatricula(req, res) {
        const {
            estudanteId,
            matriculaId
        } = req.params
        try {
            await database.Matriculas.destroy({
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            })
            return res.status(200).end()
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }


}

module.exports = PessoaController