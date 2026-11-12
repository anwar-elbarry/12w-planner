-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "startDate" DATE NOT NULL,
    "reviewDate" DATE NOT NULL,
    "gymDays" INTEGER[],
    "appsTargetDay" INTEGER NOT NULL DEFAULT 3,
    "appsTargetWeek" INTEGER NOT NULL DEFAULT 15,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayLog" (
    "date" DATE NOT NULL,
    "applications" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayLog_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "BlockCheck" (
    "date" DATE NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "BlockCheck_pkey" PRIMARY KEY ("date","blockId")
);

-- CreateTable
CREATE TABLE "PlanMonth" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "target" TEXT NOT NULL,

    CONSTRAINT "PlanMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanWeek" (
    "number" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "PlanWeek_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "PlanTask" (
    "id" SERIAL NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlanTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekReview" (
    "weekNumber" INTEGER NOT NULL,
    "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goalsDone" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
    "finished" TEXT NOT NULL DEFAULT '',
    "blocked" TEXT NOT NULL DEFAULT '',
    "next" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WeekReview_pkey" PRIMARY KEY ("weekNumber")
);

-- CreateTable
CREATE TABLE "LaterIdea" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaterIdea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanMonth_order_key" ON "PlanMonth"("order");

-- CreateIndex
CREATE UNIQUE INDEX "PlanTask_weekNumber_order_key" ON "PlanTask"("weekNumber", "order");

-- AddForeignKey
ALTER TABLE "BlockCheck" ADD CONSTRAINT "BlockCheck_date_fkey" FOREIGN KEY ("date") REFERENCES "DayLog"("date") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanWeek" ADD CONSTRAINT "PlanWeek_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "PlanMonth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTask" ADD CONSTRAINT "PlanTask_weekNumber_fkey" FOREIGN KEY ("weekNumber") REFERENCES "PlanWeek"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekReview" ADD CONSTRAINT "WeekReview_weekNumber_fkey" FOREIGN KEY ("weekNumber") REFERENCES "PlanWeek"("number") ON DELETE CASCADE ON UPDATE CASCADE;
