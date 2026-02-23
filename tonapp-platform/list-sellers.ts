import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const sellers = await prisma.seller.findMany()
    console.log('SELLERS_LIST:', JSON.stringify(sellers))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
