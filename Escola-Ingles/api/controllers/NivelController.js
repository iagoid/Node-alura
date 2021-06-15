const database = require('../models')

class NivelController {
    static async pegaTodosOsNiveis(req, res) {
        try {
            const todasAsNiveis = await database.Niveis.findAll()
            return res.status(200).json(todasAsNiveis)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async pegaUmaNivel(req, res) {
        const {
            id
        } = req.params
        try {
            const umaNivel = await database.Niveis.findOne({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(umaNivel)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async criaNivel(req, res) {
        const novaNivel = req.body
        try {
            const novaNivelCriada = await database.Niveis.create(novaNivel)
            return res.status(200).json(novaNivelCriada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async editaNivel(req, res) {
        const nivel = req.body
        const {
            id
        } = req.params
        try {
            await database.Niveis.update(nivel, {
                where: {
                    id: Number(id)
                }
            })

            const nivelAtualizada = await database.Niveis.findOne({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(nivelAtualizada)
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }

    static async deletaNivel(req, res) {
        const {
            id
        } = req.params
        try {
            await database.Niveis.destroy({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).end()
        } catch (erro) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = NivelController