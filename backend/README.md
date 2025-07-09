# API SIMTEFAC

Esse projeto se refere à API do sistema de registro de presença do SIMTEFAC.\
A linguagem de programação principal é o TypeScript, tendo como framework o Nest.js para o servidor e o TypeORM para comunicação com o banco de dados.

## Configuração

A configuração principal do projeto está no arquivo .env, localizado na pasta raíz do projeto.

| NOME          | DESCRIÇÃO     | EXEMPLPO      |
| ------------- | ------------- | ------------- |
| API_VERSION  | É utilizado para controle de configurações no banco de dados  | 1.0.0  |
| JWT_KEY  | É uma chave privada para a geração de JWT  | 3052f3a6-c179-4e6d-93a3-c11eecac645c  |
| JWT_EXPIRATION | A validade do JWT | 12h |
| DB_HOST | Endereço do servidor do banco de dados | localhost |
| DB_PORT | Porta do servidor do banco de dados | 1433 |
| DB_USERNAME | Usuário do banco de dados | sa |
| DB_PASSWORD | Senha do usuário do banco de dados | 'simposio#2023' |
| DB_DATABASE | Banco de dados | SIMTEFAC_27 |
| EMAIL_SMTP_HOST | Endereço SMTP do e-mail | 'smtp-mail.outlook.com' |
| EMAIL_SMTP_PORT | Porta do e-mail | 465 |
| EMAIL_USER | Endereço de e-mail para enviar mensagem aos usuários | 'simposio@fateccatanduva.edu.br' |
| EMAIL_PASSWORD | Senha do e-mail | 'Fatec182@' |
| EMAIL_SMTP_DEFAULT_FROM | Remetente padrão | 'simposio@fateccatanduva.edu.br' |

**Outras configurações devem ser feitas na hora de implantar a API em algum servidor, como a configuração do sertificado SSL e a abertura de portas...**

