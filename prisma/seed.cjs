// Plain CommonJS seed so it runs reliably with `node` inside the production
// Docker image (no ts-node / TypeScript toolchain required at runtime).
// Idempotent: upserts by unique slug, so restarting the container never
// duplicates cards.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

async function main() {
  for (const card of cards) {
    await prisma.card.upsert({
      where: { slug: card.slug },
      // Only refresh the core profile fields; never flip isActive back on if an
      // admin deliberately deactivated a seeded card.
      update: {
        fullName: card.fullName,
        position: card.position,
        mobilePhone: card.mobilePhone,
        companyPhone: card.companyPhone,
        extension: card.extension,
        email: card.email,
        website: card.website,
        address: card.address,
      },
      create: card,
    });
    console.log(`  ✓ upserted ${card.fullName} (/${card.slug})`);
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
