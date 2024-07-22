import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seedPromise = prisma.$executeRaw`
  COPY "Organization"(sansan_organization_code,url,country_code,corporate_number,name,name_furigana,address_inside,prefecture_name,prefecture_code,updated_at)
  FROM '/tmp/organization.csv'
  WITH CSV
  DELIMITER ','
  HEADER
`;
  await seedPromise;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
