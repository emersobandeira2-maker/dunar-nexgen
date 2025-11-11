import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = 'Erick@123'
  const passwordHash = await bcrypt.hash(password, 10)
  
  await prisma.user.update({
    where: { email: 'erickallison@icloud.com' },
    data: { passwordHash }
  })
  
  console.log('✅ Senha do Erick Allison redefinida para: Erick@123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
