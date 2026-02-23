import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'seller@test.com'
    const password = 'password123'
    const phone = '+237600000000'

    const passwordHash = await bcrypt.hash(password, 10)

    const seller = await prisma.seller.create({
        data: {
            email,
            phone_primary: phone,
            first_name: 'Vendeur',
            last_name: 'Test',
            password_hash: passwordHash,
        },
    })

    // Create a shop for this seller
    await prisma.shop.create({
        data: {
            seller_id: seller.id,
            shop_name: "Ma Super Boutique",
            slug: "ma-boutique-test",
            whatsapp_number: phone,
        },
    })

    console.log('SELLER_CREATED:', JSON.stringify({ email, password }))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
