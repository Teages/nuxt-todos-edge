import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

let prisma: PrismaClient | undefined
export function usePrisma(): PrismaClient {
  if (!prisma) {
    const adapter = new PrismaD1(hubDatabase())
    prisma = new PrismaClient({ adapter })
    prisma.$connect()
  }
  return prisma
}
