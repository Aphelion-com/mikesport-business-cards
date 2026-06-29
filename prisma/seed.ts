import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cards = [
    {
      fullName: "Rawad Halloun",
      slug: "rawad-halloun",
      position: "Retail Director",
      mobilePhone: "+96179409364",
      companyPhone: "+9611888855",
      extension: null,
      email: "rawad.halloun@mikesport.com",
      website: "https://www.mikesport.com",
      address: "Head Office - Zalka Highway",
      isActive: true,
    },
    {
      fullName: "Simon Haddad",
      slug: "simon-haddad",
      position: "Buying & Selection Manager",
      mobilePhone: "+9613072431",
      companyPhone: "+9611888855",
      extension: "1560",
      email: "simon.haddad@mikesport.com",
      website: "https://www.mikesport.com",
      address: "Head Office - Zalka Highway",
      isActive: true,
    },
  ];

  for (const card of cards) {
    await prisma.card.upsert({
      where: { slug: card.slug },
      update: card,
      create: card,
    });
    console.log(`Seeded card: ${card.fullName} (/${card.slug})`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
