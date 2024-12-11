import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { method_type } from '../modules/subcription/dto/method-recovery.dto';
import { accounts } from './data-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting and seeding database...');

  // Restablecer tablas en orden debido a relaciones
  await prisma.$transaction([
    prisma.categories_service.deleteMany(),
    prisma.service.deleteMany(),
    prisma.recovery_methods.deleteMany(),
    prisma.subscription_detail.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('All tables cleared!');

  const hashedPassword1 = await bcrypt.hash('123456', 10);

  // Crear usuarios
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'johndoe@gmail.com',
        password: hashedPassword1, // Idealmente, usa bcrypt para hashear contraseñas.
        user_name: 'john-doe',
      },
      {
        email: 'janedoe@gmail.com',
        password: hashedPassword1,
        user_name: 'jane-doe',
      },
    ],
  });
  console.log(`Inserted ${users.count} users.`);

  // Crear cuentas relacionadas con usuarios
  await prisma.account.createMany({
    data: accounts,
  });

  await prisma.categories_service.createMany({
    data: [{ name: 'servicio de almacenamiento' }],
  });

  await prisma.service.createMany({
    data: [
      { name: 'google drive', categories_services_id: 1 },
      { name: 'mega', categories_services_id: 1 },
    ],
  });

  const prismaTx = await prisma.$transaction(async (tx) => {
    let subcription: any;
    let subcription_detail: any;

    const accounts = await prisma.account.findMany();

    accounts.forEach(async (account) => {
      subcription = await prisma.subscription.create({
        data: {
          user_name_subscription: '',
          services_id: 1,
          account_id: account.id,
        },
      });

      subcription_detail = await prisma.subscription_detail.create({
        data: {
          subcription_id: subcription.id,
        },
      });
      const subcriptions_detaitls = await prisma.subscription_detail.findMany();

      await prisma.recovery_methods.create({
        data: {
          method_value: '12456',
          method_type: 'password_recovery',
          subscription_detail_id: subcription_detail.id,
        },
      });
    });

    return {
      subcription,
      subcription_detail,
    };
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
