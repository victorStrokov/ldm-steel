-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NEW', 'ACCEPTED', 'RESPONDED', 'AGREED', 'DECLINED', 'CANCELLED', 'LOST');

-- CreateTable
CREATE TABLE "InquiryManagerTask" (
    "id" SERIAL NOT NULL,
    "inquiryId" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'NEW',
    "acceptedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "offeredAmount" DECIMAL(12,2),
    "finalAmount" DECIMAL(12,2),
    "resultReason" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryManagerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryEventLog" (
    "id" SERIAL NOT NULL,
    "inquiryId" INTEGER NOT NULL,
    "taskId" INTEGER,
    "actorId" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "oldValue" VARCHAR(2000),
    "newValue" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InquiryManagerTask_inquiryId_idx" ON "InquiryManagerTask"("inquiryId");
CREATE INDEX "InquiryManagerTask_managerId_idx" ON "InquiryManagerTask"("managerId");
CREATE INDEX "InquiryManagerTask_tenantId_idx" ON "InquiryManagerTask"("tenantId");
CREATE INDEX "InquiryManagerTask_status_idx" ON "InquiryManagerTask"("status");

-- CreateIndex
CREATE INDEX "InquiryEventLog_inquiryId_idx" ON "InquiryEventLog"("inquiryId");
CREATE INDEX "InquiryEventLog_taskId_idx" ON "InquiryEventLog"("taskId");
CREATE INDEX "InquiryEventLog_actorId_idx" ON "InquiryEventLog"("actorId");

-- AddForeignKey
ALTER TABLE "InquiryManagerTask" ADD CONSTRAINT "InquiryManagerTask_inquiryId_fkey"
    FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InquiryManagerTask" ADD CONSTRAINT "InquiryManagerTask_managerId_fkey"
    FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InquiryManagerTask" ADD CONSTRAINT "InquiryManagerTask_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEventLog" ADD CONSTRAINT "InquiryEventLog_inquiryId_fkey"
    FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InquiryEventLog" ADD CONSTRAINT "InquiryEventLog_taskId_fkey"
    FOREIGN KEY ("taskId") REFERENCES "InquiryManagerTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InquiryEventLog" ADD CONSTRAINT "InquiryEventLog_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
