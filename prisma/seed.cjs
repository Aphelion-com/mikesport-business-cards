// Plain CommonJS seed so it runs reliably with `node` inside the production
// Docker image (no ts-node / TypeScript toolchain required at runtime).
// Idempotent: upserts by unique slug / fixed settings id, so restarting the
// container never duplicates data.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cards = [
  {
    fullName: "Rawad Halloun",
    slug: "rawad-halloun",
    position: "Retail Director",
    department: "Retail",
    companyName: "Mike Sport",
    officeLocation: "Head Office - Zalka Highway",
    description:
      "Retail Director at Mike Sport, leading retail operations and customer experience across the store network.",
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
    department: "Buying & Selection",
    companyName: "Mike Sport",
    officeLocation: "Head Office - Zalka Highway",
    description:
      "Buying & Selection Manager at Mike Sport, supporting product selection, buying strategy, and retail assortment planning.",
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
  // Default app settings (singleton row).
  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      dashboardTitle: "Mike Sport Cards",
      accentColor: "#f97316",
      companyWebsite: "https://www.mikesport.com",
      defaultAddress: "Head Office - Zalka Highway",
      defaultCompanyPhone: "+9611888855",
    },
  });
  console.log("  ✓ app settings ready");

  for (const card of cards) {
    await prisma.card.upsert({
      where: { slug: card.slug },
      // Refresh core profile fields; never flip isActive back on if an admin
      // deliberately deactivated a seeded card, and never overwrite a profile
      // image the admin may have uploaded.
      update: {
        fullName: card.fullName,
        position: card.position,
        department: card.department,
        companyName: card.companyName,
        officeLocation: card.officeLocation,
        description: card.description,
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
