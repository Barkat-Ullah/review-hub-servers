// prisma/seed.ts

import { User_Role } from '../generated/prisma';

import * as bcrypt from 'bcrypt';
import prisma from '../src/utils/prisma';

async function main() {
    const adminExists = await prisma.user.findFirst({
        where: { role: User_Role.ADMIN },
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                username: 'admin11',
                email: 'admin@example.com',
                password: hashedPassword,
                role: User_Role.ADMIN,
            },
        });
        console.log('✅ Admin user created successfully!');
    } else {
        console.log('⚠️ Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error('❌ Error while seeding:', e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
