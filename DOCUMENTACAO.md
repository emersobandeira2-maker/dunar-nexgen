# Documentação - Dunar NexGen

## Sistema de Gestão de Reservas e Controle de Acesso

**Versão:** 1.0  
**Data:** 09/11/2025  
**Status:** Sistema Full-Stack Implementado

---

## 1. Credenciais de Acesso

### Administrador Principal

- **Usuário:** `admin`
- **Senha:** `Admin@duna`
- **Email:** `emersobandeira@yahoo.com.br`

---

## 2. Tecnologias Implementadas

### Frontend
- **Next.js 16.0.0** - Framework React com App Router
- **React 19.2.0** - Biblioteca de interface
- **TypeScript 5.x** - Tipagem estática
- **Tailwind CSS 4.x** - Framework de estilização
- **Turbopack** - Bundler de alta performance

### Backend
- **Next.js API Routes** - Endpoints REST
- **Prisma ORM** - Gerenciamento de banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **NextAuth.js v5** - Autenticação e sessões
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de dados

---

## 3. Estrutura do Banco de Dados

### Tabelas Implementadas

#### Admin
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `passwordHash` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### User (Clientes)
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `phone` (String, Optional)
- `passwordHash` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Vehicle (Veículos/Placas)
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → User)
- `plate` (String, Unique)
- `plateRole` (String: "Comum", "Cooperado", "Evento", "Proprietario")
- `createdAt` (DateTime)

#### Ticket (Pagamentos/Entradas)
- `id` (UUID, Primary Key)
- `reservationId` (UUID, Optional, Foreign Key → Reservation)
- `vehicleId` (UUID, Foreign Key → Vehicle)
- `passengers` (Integer)
- `useDate` (DateTime)
- `paymentStatus` (String: "Pendente", "Pago")
- `ticketStatus` (String: "Aguardando Liberação", "Liberado", "Expirado")
- `paymentMethod` (String, Optional)
- `paymentId` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Reservation (Reservas)
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → User)
- `vehicleId` (UUID, Foreign Key → Vehicle)
- `passengers` (Integer)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `status` (String: "pending", "confirmed", "cancelled")
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 4. Endpoints da API

### Autenticação

#### POST `/api/auth/callback/credentials`
Realiza login de administrador.

**Body:**
```json
{
  "username": "admin",
  "password": "Admin@duna"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "admin",
    "email": "emersobandeira@yahoo.com.br"
  }
}
```

---

### Administradores

#### GET `/api/admins`
Lista todos os administradores cadastrados.

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "admin",
    "email": "emersobandeira@yahoo.com.br",
    "createdAt": "2025-11-09T12:00:00Z"
  }
]
```

#### POST `/api/admins`
Cria um novo administrador.

**Body:**
```json
{
  "username": "novo_admin",
  "email": "email@exemplo.com",
  "password": "SenhaSegura123"
}
```

#### DELETE `/api/admins/[id]`
Deleta um administrador (não permite deletar o último).

---

### Tickets

#### GET `/api/tickets`
Lista todos os tickets cadastrados.

**Response:**
```json
[
  {
    "id": "uuid",
    "vehicle": {
      "plate": "ABC-1234",
      "plateRole": "Comum"
    },
    "passengers": 4,
    "useDate": "2025-11-10T00:00:00Z",
    "paymentStatus": "Pago",
    "ticketStatus": "Aguardando Liberação"
  }
]
```

#### POST `/api/tickets`
Cria um novo ticket (reserva avulsa).

**Body:**
```json
{
  "plate": "ABC-1234",
  "passengers": 4,
  "useDate": "2025-11-10",
  "plateRole": "Comum",
  "paymentStatus": "Pago"
}
```

#### PUT `/api/tickets/[id]`
Atualiza o status de um ticket.

**Body:**
```json
{
  "ticketStatus": "Liberado"
}
```

#### DELETE `/api/tickets/[id]`
Deleta um ticket.

---

### Reservas

#### GET `/api/reservations`
Lista todas as reservas.

**Query Params:**
- `userId` (opcional) - Filtrar por usuário

#### POST `/api/reservations`
Cria uma nova reserva.

**Body:**
```json
{
  "userId": "uuid",
  "plate": "ABC-1234",
  "passengers": 4,
  "startDate": "2025-11-10T10:00:00Z",
  "endDate": "2025-11-10T18:00:00Z",
  "plateRole": "Comum"
}
```

---

## 5. Funcionalidades Implementadas

### Painel Administrativo

#### Login e Autenticação ✅
- Login com usuário e senha
- Sessão JWT segura
- Proteção de rotas administrativas
- Logout funcional

#### Gestão de Pagamentos ✅
- Listagem de todos os tickets
- Criação de reservas avulsas
- Liberação manual de entradas
- Pesquisa por placa
- Filtros por tipo de placa

#### Cadastro de Administradores ✅
- Listagem de administradores
- Criação de novos administradores
- Exclusão de administradores
- Validação de unicidade de usuário/email
- Proteção contra exclusão do último admin

#### Segurança ✅
- Senhas criptografadas com bcrypt
- Tokens JWT para sessões
- Middleware de proteção de rotas
- Validação de dados de entrada

---

## 6. Como Executar o Projeto

### Pré-requisitos
- Node.js 22.x ou superior
- npm ou pnpm

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
O arquivo `.env` já está configurado com:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dunar-secret-key-change-in-production-2024"
```

3. **Executar migrations do banco de dados:**
```bash
npx prisma migrate dev
```

4. **Popular banco de dados com usuário admin:**
```bash
npx tsx prisma/seed.ts
```

5. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

---

## 7. Estrutura de Diretórios

```
Dunar-NexGen-main/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.ts                # Script de seed
│   └── migrations/            # Migrations do Prisma
├── src/
│   ├── app/
│   │   ├── admin/             # Páginas do painel administrativo
│   │   │   ├── page.tsx       # Login
│   │   │   ├── pagamentos/    # Gestão de pagamentos
│   │   │   ├── cadastro/      # Cadastro de admins
│   │   │   └── relatorios/    # Relatórios (em desenvolvimento)
│   │   ├── cliente/           # Páginas do portal do cliente
│   │   ├── api/               # Rotas da API
│   │   │   ├── auth/          # Autenticação NextAuth
│   │   │   ├── admins/        # CRUD de administradores
│   │   │   ├── tickets/       # CRUD de tickets
│   │   │   └── reservations/  # CRUD de reservas
│   │   ├── layout.tsx         # Layout principal
│   │   └── providers.tsx      # Provedor de sessão
│   ├── components/
│   │   └── ui/                # Componentes reutilizáveis
│   ├── lib/
│   │   ├── db.ts              # Cliente Prisma
│   │   └── dunar.tsx          # Tipos e utilidades
│   └── middleware.ts          # Middleware de autenticação
├── public/                    # Assets estáticos
├── package.json
└── .env                       # Variáveis de ambiente
```

---

## 8. Próximas Implementações Sugeridas

### Funcionalidades Pendentes

1. **Portal do Cliente**
   - Autenticação de clientes
   - Cadastro de novos clientes
   - Criação de reservas
   - Integração com gateway de pagamento
   - Histórico de reservas

2. **Relatórios**
   - Dashboard com métricas
   - Relatório de entradas por período
   - Relatório de receitas
   - Exportação para PDF/Excel

3. **Recuperação de Senha**
   - Envio de email com token
   - Reset de senha

4. **Notificações**
   - Email de confirmação de reserva
   - SMS de liberação de entrada
   - Alertas de pagamento pendente

5. **Melhorias de UX**
   - Busca em tempo real
   - Paginação de tabelas
   - Filtros avançados
   - Loading states aprimorados

---

## 9. Migração para Produção

### Banco de Dados

Para produção, recomenda-se migrar de SQLite para PostgreSQL:

1. **Alterar o schema do Prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Atualizar .env:**
```env
DATABASE_URL="postgresql://user:password@host:5432/dunar_db"
```

3. **Executar migrations:**
```bash
npx prisma migrate deploy
```

### Variáveis de Ambiente

Alterar `NEXTAUTH_SECRET` para um valor seguro:
```bash
openssl rand -base64 32
```

### Deploy

Recomendações de plataforma:
- **Vercel** (recomendado para Next.js)
- **AWS Amplify**
- **Railway**
- **Render**

---

## 10. Suporte e Manutenção

### Logs

Logs do servidor estão em `/tmp/nextjs-dev.log` (desenvolvimento).

### Backup do Banco de Dados

```bash
# SQLite
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# PostgreSQL
pg_dump dunar_db > backup-$(date +%Y%m%d).sql
```

### Atualização de Dependências

```bash
npm update
npx prisma migrate dev
```

---

## 11. Contato

Para dúvidas ou suporte:
- **Email:** emersobandeira@yahoo.com.br

---

**Desenvolvido com Next.js, Prisma e NextAuth.js**  
**© 2025 Dunar NexGen - Todos os direitos reservados**
