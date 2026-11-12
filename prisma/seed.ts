import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { GYM_DAYS, PLAN, REVIEW_DATE, START_DATE } from "../src/lib/plan-content";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// Idempotent: settings are created once, plan rows are upserted by position,
// so running the seed again never wipes what you ticked.
async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      startDate: new Date(START_DATE),
      reviewDate: new Date(REVIEW_DATE),
      gymDays: GYM_DAYS,
    },
  });

  let weekNumber = 0;
  for (const [m, month] of PLAN.entries()) {
    const row = await prisma.planMonth.upsert({
      where: { order: m + 1 },
      update: { title: month.title, target: month.target },
      create: { order: m + 1, title: month.title, target: month.target },
    });
    for (const tasks of month.weeks) {
      weekNumber++;
      await prisma.planWeek.upsert({
        where: { number: weekNumber },
        update: { monthId: row.id },
        create: { number: weekNumber, monthId: row.id },
      });
      for (const [i, text] of tasks.entries()) {
        await prisma.planTask.upsert({
          where: { weekNumber_order: { weekNumber, order: i } },
          update: { text },
          create: { weekNumber, order: i, text },
        });
      }
    }
  }
  console.log(`Seeded settings and ${weekNumber} plan weeks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
