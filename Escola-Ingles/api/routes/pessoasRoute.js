const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController')

const router = Router()

router.get('/pessoas', PessoaController.pegaTodasAsPessoas)
router.get('/pessoas/:id', PessoaController.pegaUmaPessoa)
router.post('/pessoas', PessoaController.criaPessoa)
router.put('/pessoas/:id', PessoaController.editaPessoa)
router.delete('/pessoas/:id', PessoaController.deletaPessoa)
router.get('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.pegaUmaMatricula)
router.post('/pessoas/:estudanteId/matriculas', PessoaController.criaMatricula)
router.delete('/pessoas/:estudanteId/matriculas/:matriculaId', PessoaController.deletaMatricula)


module.exports = router