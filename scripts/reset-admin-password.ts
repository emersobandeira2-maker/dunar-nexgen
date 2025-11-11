import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const newPassword = 'Admin@dunar'
  
  // Gerar hash da nova senha
  const passwordHash = await bcrypt.hash(newPassword, 10)

  // Atualizar senha do admin
  const admin = await prisma.admin.update({
    where: { username: 'admin' },
    data: {
      passwordHash,
    },
  })

  console.log('✅ Senha do superadmin redefinida com sucesso!')
  console.log('   Username: admin')
  console.log('   Nova senha: Admin@dunar')
  console.log('   Email:', admin.email)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao redefinir senha:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
