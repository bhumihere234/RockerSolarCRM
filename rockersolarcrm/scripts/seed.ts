import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Mukul Gupta", email: "mukul@rockersolar.com", password: "Pass@1234", role: "salesperson" },
    { name: "User 2", email: "user2@rockersolar.com", password: "Pass@1234", role: "salesperson" },
    { name: "User 3", email: "user3@rockersolar.com", password: "Pass@1234", role: "salesperson" },
    { name: "User 4", email: "user4@rockersolar.com", password: "Pass@1234", role: "salesperson" },
    { name: "User 5", email: "user5@rockersolar.com", password: "Pass@1234", role: "salesperson" },
    { name: "User 6", email: "user6@rockersolar.com", password: "Pass@1234", role: "salesperson" },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
