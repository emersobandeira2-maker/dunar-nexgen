import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Constantes do Prêmio Vitalício
 */
export const LIFETIME_PRIZE_CONFIG = {
  FREE_PLATES_PER_DAY: 6, // Quantidade de placas gratuitas por dia
  RESET_HOUR: 0, // Hora de reset (meia-noite)
}

/**
 * Verifica se o usuário tem prêmio vitalício ativo
 */
export async function hasLifetimePrize(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lifetimePrize: true }
    })
    
    return user?.lifetimePrize || false
  } catch (error) {
    console.error('Erro ao verificar prêmio vitalício:', error)
    return false
  }
}

/**
 * Conta quantas placas gratuitas o usuário já usou hoje
 */
export async function countFreePlatesUsedToday(userId: string): Promise<number> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const count = await prisma.ticket.count({
      where: {
        reservation: {
          userId: userId
        },
        isFree: true,
        useDate: {
          gte: today,
          lt: tomorrow
        }
      }
    })
    
    return count
  } catch (error) {
    console.error('Erro ao contar placas gratuitas usadas:', error)
    return 0
  }
}

/**
 * Verifica se o usuário ainda tem placas gratuitas disponíveis hoje
 */
export async function hasFreePlatesAvailable(userId: string): Promise<boolean> {
  const hasLifetime = await hasLifetimePrize(userId)
  
  if (!hasLifetime) {
    return false
  }
  
  const usedToday = await countFreePlatesUsedToday(userId)
  return usedToday < LIFETIME_PRIZE_CONFIG.FREE_PLATES_PER_DAY
}

/**
 * Retorna quantas placas gratuitas ainda estão disponíveis hoje
 */
export async function getAvailableFreePlates(userId: string): Promise<number> {
  const hasLifetime = await hasLifetimePrize(userId)
  
  if (!hasLifetime) {
    return 0
  }
  
  const usedToday = await countFreePlatesUsedToday(userId)
  const available = LIFETIME_PRIZE_CONFIG.FREE_PLATES_PER_DAY - usedToday
  
  return Math.max(0, available)
}

/**
 * Retorna informações completas sobre o status do prêmio vitalício
 */
export async function getLifetimePrizeStatus(userId: string) {
  const hasLifetime = await hasLifetimePrize(userId)
  
  if (!hasLifetime) {
    return {
      hasLifetimePrize: false,
      totalFreePlatesPerDay: 0,
      usedToday: 0,
      availableToday: 0,
      nextReset: null
    }
  }
  
  const usedToday = await countFreePlatesUsedToday(userId)
  const availableToday = Math.max(0, LIFETIME_PRIZE_CONFIG.FREE_PLATES_PER_DAY - usedToday)
  
  // Calcular próximo reset (meia-noite)
  const nextReset = new Date()
  nextReset.setHours(24, 0, 0, 0) // Próxima meia-noite
  
  return {
    hasLifetimePrize: true,
    totalFreePlatesPerDay: LIFETIME_PRIZE_CONFIG.FREE_PLATES_PER_DAY,
    usedToday,
    availableToday,
    nextReset
  }
}

/**
 * Calcula o preço de uma reserva considerando o prêmio vitalício
 */
export async function calculateReservationPrice(
  userId: string,
  basePrice: number,
  numberOfPlates: number = 1
): Promise<{
  totalPrice: number
  freePlates: number
  paidPlates: number
  breakdown: Array<{ plate: number; price: number; isFree: boolean }>
}> {
  const availableFree = await getAvailableFreePlates(userId)
  const freePlates = Math.min(numberOfPlates, availableFree)
  const paidPlates = numberOfPlates - freePlates
  
  const breakdown = []
  for (let i = 0; i < numberOfPlates; i++) {
    const isFree = i < freePlates
    breakdown.push({
      plate: i + 1,
      price: isFree ? 0 : basePrice,
      isFree
    })
  }
  
  return {
    totalPrice: paidPlates * basePrice,
    freePlates,
    paidPlates,
    breakdown
  }
}

export default {
  hasLifetimePrize,
  countFreePlatesUsedToday,
  hasFreePlatesAvailable,
  getAvailableFreePlates,
  getLifetimePrizeStatus,
  calculateReservationPrice,
  LIFETIME_PRIZE_CONFIG
}
