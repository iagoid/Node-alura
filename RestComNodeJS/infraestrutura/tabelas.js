class Tabelas {
    init(conexao) {
        this.conexao = conexao

        this.criarAtendimentos()
    }

    criarAtendimentos() {
        const sql = `CREATE TABLE IF NOT EXISTS Atendimentos 
            (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar(30), 
            servico varchar(20) NOT NULL, status varchar(20) NOT NULL, observacoes text,
            data datetime NOT NULL, dataCriacao datetime NOT NULL, PRIMARY KEY(id))`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro)
            } else {
                console.log("Tarefa criada com sucesso")
            }
        })
    }
}

module.exports = new Tabelas