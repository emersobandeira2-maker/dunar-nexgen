# Dunar - NexGen

Sistema completo de gestão de reservas e controle de acesso com backend e banco de dados implementados.

## 🚀 Início Rápido

### Credenciais de Acesso
- **Usuário:** `admin`
- **Senha:** `Admin@duna`
- **Email:** `emersobandeira@yahoo.com.br`

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Executar migrations do banco de dados
npx prisma migrate dev

# 3. Popular banco com usuário admin (se necessário)
npx tsx prisma/seed.ts

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000/admin`

## 📚 Documentação Completa

Consulte o arquivo [DOCUMENTACAO.md](./DOCUMENTACAO.md) para informações detalhadas sobre:
- Estrutura do banco de dados
- Endpoints da API
- Funcionalidades implementadas
- Deploy em produção

## 🛠 Tecnologias

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4
- **Backend:** Next.js API Routes + Prisma ORM
- **Banco de Dados:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação:** NextAuth.js v5

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/          # Painel administrativo
│   ├── cliente/        # Portal do cliente
│   └── api/            # Rotas da API
├── components/         # Componentes reutilizáveis
└── lib/                # Utilitários e configurações
```

## ✅ Funcionalidades Implementadas

- ✅ Autenticação de administradores
- ✅ Gestão de tickets e pagamentos
- ✅ Cadastro de administradores
- ✅ Reservas avulsas
- ✅ Liberação de entradas
- ✅ Proteção de rotas
- ✅ Criptografia de senhas

## 📝 Licença

Todos os direitos reservados © 2025 Dunar NexGen
