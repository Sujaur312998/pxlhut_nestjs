-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentIntent" TEXT,
ADD COLUMN     "receiptEmail" TEXT,
ADD COLUMN     "sessionId" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'USD';
