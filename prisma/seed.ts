import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Verificar se já existe um admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (existingAdmin) {
    console.log('✅ Administrador já existe no banco de dados.')
    return
  }

  // Criar hash da senha
  const passwordHash = await bcrypt.hash('Admin@duna', 10)

  // Criar administrador inicial
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      email: 'emersobandeira@yahoo.com.br',
      passwordHash: passwordHash,
    }
  })

  console.log('✅ Administrador criado com sucesso:')
  console.log('   Username:', admin.username)
  console.log('   Email:', admin.email)
  console.log('   Senha: Admin@duna')
  console.log('')
  console.log('🎉 Seed concluído!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao executar seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
