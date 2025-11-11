import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Verificar se usuário adm já existe
  const existingAdm = await prisma.admin.findUnique({
    where: { username: 'adm' }
  })

  if (existingAdm) {
    console.log('✅ Usuário "adm" já existe!')
    return
  }

  // Hash da senha @dunar
  const passwordHash = await bcrypt.hash('@dunar', 10)

  // Criar usuário administrador
  const adm = await prisma.admin.create({
    data: {
      username: 'adm',
      email: 'adm@dunar.com.br',
      phone: null,
      passwordHash,
      role: 'ADMIN',
      isSuperAdmin: false,
      twoFactorEnabled: false,
    }
  })

  console.log('✅ Usuário "adm" criado com sucesso!')
  console.log('   Username: adm')
  console.log('   Senha: @dunar')
  console.log('   Role: ADMIN')
  console.log('   ID:', adm.id)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar usuário:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
