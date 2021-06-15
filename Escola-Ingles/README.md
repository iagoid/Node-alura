Criar os models
npx sequelize-cli init
Cria as páginas no diretório raiz, então colocar tudo dentro da API
Ai colocar o arquivo .sequelizerc para configurar o caminho


Para criar o banco de dados
*LEMBRE-SE DE CRIAR NA ORDEM CORRETA POIS AS MIGRAÇÕES SÃO  FEITAS NOS ORÁRIOS NO MIGRATIONS
npm install sequelize-cli
npx sequelize-cli model:create --name Pessoas --attributes nome:string,ativo:boolean,email:string,role:string


Migrar banco 
npx sequelize-cli db:migrate 
Talvez seja necessário  --> npm install pg --save

Seeds
npx sequelize-cli seed:generate --name demo-Pessoa
Ir no seed e tirar os comentários, então colocar as informacoes da tabela


Desfazendo Migrações
npx sequelize-cli db:migrate:undo
Este comando vai desfazer somente a última migração feita, na ordem em que os arquivos são lidos e executados pelo Sequelize (de acordo com as datas e horários no nome dos arquivos). Se você tiver rodado 3 migrações - por exemplo, das tabelas Niveis, Turmas e Matriculas, o comando npx sequelize-cli db:migrate:undo vai desfazer apenas Matriculas.
Uma migração especifica
db:migrate:undo --name [data-hora]-create-[nome-da-tabela].js

Desfzendo seed
npx sequelize-cli db:seed:undo:all