# Configuração do Mercado Pago

## 📋 Pré-requisitos

Para usar a integração com Mercado Pago, você precisa:

1. **Conta no Mercado Pago** (criar em https://www.mercadopago.com.br)
2. **Credenciais de API** (Access Token e Public Key)

---

## 🔑 Como Obter as Credenciais

### 1. Acessar o Painel de Desenvolvedores

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login com sua conta Mercado Pago
3. Vá em **"Suas integrações"** → **"Criar aplicação"**

### 2. Criar uma Aplicação

1. Clique em **"Criar aplicação"**
2. Preencha:
   - **Nome:** Dunar NexGen
   - **Descrição:** Sistema de reservas e pagamentos
   - **Modelo de integração:** Checkout Pro
3. Clique em **"Criar aplicação"**

### 3. Obter as Credenciais

Após criar a aplicação, você verá duas abas:

#### **Credenciais de Teste** (para desenvolvimento)
- Access Token: `TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx`
- Public Key: `TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

#### **Credenciais de Produção** (para uso real)
- Access Token: `APP_USR-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxx`
- Public Key: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## ⚙️ Configurar no Projeto

### 1. Editar o arquivo `.env`

Abra o arquivo `.env` na raiz do projeto e substitua as credenciais:

```env
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN="TEST-seu-access-token-aqui"
MERCADOPAGO_PUBLIC_KEY="TEST-seu-public-key-aqui"
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-seu-public-key-aqui"
```

**⚠️ IMPORTANTE:**
- Para **desenvolvimento/testes**, use as credenciais que começam com `TEST-`
- Para **produção**, use as credenciais que começam com `APP_USR-`
- **NUNCA** commite o arquivo `.env` no Git (já está no `.gitignore`)

### 2. Reiniciar o Servidor

Após alterar as credenciais:

```bash
# Parar o servidor (Ctrl+C)
# Reiniciar
npm run dev
```

---

## 🧪 Testar a Integração

### 1. Acessar o Portal do Cliente

```
http://localhost:3000/cliente/portal
```

### 2. Criar uma Nova Reserva

1. Clique em **"Nova reserva"**
2. Preencha:
   - Placa: ABC-1234
   - Passageiros: 2
   - Data da visita: (qualquer data futura)
3. Clique em **"Realizar Pagamento"**

### 3. Testar o Pagamento

Você será redirecionado para o **Checkout do Mercado Pago**.

#### Cartões de Teste (Ambiente de Teste)

Use estes dados para simular pagamentos:

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `APRO`
- CPF: `12345678909`

**Cartão Recusado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `OTHE`
- CPF: `12345678909`

**Cartão Pendente:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `CONT`
- CPF: `12345678909`

Mais cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards

---

## 🔔 Configurar Webhooks (Notificações)

Os webhooks permitem que o Mercado Pago notifique seu sistema quando um pagamento é processado.

### 1. URL do Webhook

No painel do Mercado Pago:

1. Vá em **"Suas integrações"** → **Sua aplicação**
2. Clique em **"Webhooks"**
3. Configure a URL:

**Desenvolvimento (local):**
```
https://seu-dominio-ngrok.ngrok.io/api/payment/webhook
```

**Produção:**
```
https://seu-dominio.com.br/api/payment/webhook
```

### 2. Eventos para Notificar

Marque:
- ✅ **Pagamentos** (payment)
- ✅ **Merchant Orders** (merchant_order)

---

## 💰 Valores e Taxas

### Preço por Passageiro

Atualmente configurado em: **R$ 50,00 por pessoa**

Para alterar, edite o arquivo:
```
src/app/cliente/portal/page.tsx
```

Procure por:
```typescript
const pricePerPerson = 50.00 // Altere aqui
```

### Taxas do Mercado Pago

O Mercado Pago cobra taxas sobre cada transação:
- **Cartão de crédito:** ~4,99% + R$ 0,39
- **Pix:** ~0,99%
- **Boleto:** R$ 3,49 por transação

Consulte as taxas atualizadas em: https://www.mercadopago.com.br/costs-section/

---

## 🚀 Migrar para Produção

### 1. Obter Credenciais de Produção

1. No painel do Mercado Pago, vá em **"Credenciais de produção"**
2. Complete o formulário de ativação (dados da empresa, etc.)
3. Aguarde aprovação (pode levar alguns dias)

### 2. Atualizar `.env`

```env
MERCADOPAGO_ACCESS_TOKEN="APP_USR-seu-access-token-de-producao"
MERCADOPAGO_PUBLIC_KEY="APP_USR-seu-public-key-de-producao"
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-seu-public-key-de-producao"
```

### 3. Configurar Webhook de Produção

Atualize a URL do webhook no painel para o domínio de produção.

---

## 📊 Monitorar Pagamentos

### Painel do Mercado Pago

Acesse: https://www.mercadopago.com.br/activities

Você pode:
- Ver todas as transações
- Verificar status de pagamentos
- Fazer estornos
- Baixar relatórios

### No Sistema Dunar

Os pagamentos são registrados na tabela `Ticket` do banco de dados:
- `paymentStatus`: "Pendente" ou "Pago"
- `paymentId`: ID da transação no Mercado Pago
- `paymentMethod`: "mercadopago"

---

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha o Access Token no frontend**
   - Sempre use variáveis de ambiente
   - Apenas a Public Key pode ser exposta

2. **Valide webhooks**
   - Sempre verifique a autenticidade das notificações
   - Use a API do Mercado Pago para confirmar o status

3. **Use HTTPS em produção**
   - Mercado Pago exige HTTPS para webhooks

4. **Proteja suas credenciais**
   - Não commite no Git
   - Use variáveis de ambiente
   - Rotacione periodicamente

---

## 🆘 Suporte

### Documentação Oficial

- **Checkout Pro:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- **API Reference:** https://www.mercadopago.com.br/developers/pt/reference
- **SDKs:** https://www.mercadopago.com.br/developers/pt/docs/sdks-library/landing

### Comunidade

- **Fórum:** https://www.mercadopago.com.br/developers/pt/support
- **Status da API:** https://status.mercadopago.com/

---

## ✅ Checklist de Implementação

- [x] SDK do Mercado Pago instalado
- [x] Credenciais configuradas no `.env`
- [x] API de criar preferência implementada
- [x] API de webhook implementada
- [x] Integração no portal do cliente
- [x] Página de resultado de pagamento
- [ ] Configurar credenciais reais
- [ ] Configurar webhook em produção
- [ ] Testar com cartões reais
- [ ] Implementar estornos (se necessário)

---

**Desenvolvido para Dunar NexGen**  
**Última atualização:** 09/11/2025
