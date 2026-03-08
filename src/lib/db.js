import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_7MZJzIRkmbH1@ep-blue-bar-a7skyf76-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true",
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}