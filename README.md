# 🎯 Simtefac

**Simtefac** é um sistema inteligente de gerenciamento de eventos, focado em simplificar a organização, otimizar o controle de presença através de QR Code e gerar certificados automáticos para os participantes. Com o intuito de ajudar a organização dos simpósios da Fatec Catanduva.

## 🚀 Funcionalidades

- ✅ Cadastro de eventos
- ✅ Gerenciamento de participantes
- ✅ Check-in via QR Code
- ✅ Geração automática de certificados
- ✅ Dashboard intuitiva
- ✅ Envio de certificados por e-mail

## 💡 Tecnologias Utilizadas

- **Frontend:** React / Next.js
- **Backend:** Node.js com NestJS
- **Banco de Dados:** SQLServe
- **Leitor de QR Code:** Biblioteca de leitura no frontend ou app mobile
- **Hospedagem:** Azure

## 🏗️ Como Rodar o Projeto

### 🔧 Pré-requisitos

- Node.js
- Gerenciador de pacotes (npm, yarn ou pnpm)
- Banco de dados configurado

### 🚦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/simtefac.git

# Acesse a pasta
cd simtefac

# Instale as dependências
npm i -f

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas credenciais

# Inicie o servidor
npm run start
