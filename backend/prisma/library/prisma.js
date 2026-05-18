const { PrismaClient } = require('../../src/generated/client');
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const globalForPrisma = globalThis

const Prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = Prisma

module.exports = { Prisma }