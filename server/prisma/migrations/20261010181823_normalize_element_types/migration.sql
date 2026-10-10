/*
  Warnings:

  - The values [Text] on the enum `ElementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ElementType_new" AS ENUM ('TEXT', 'IMAGE', 'STICKER', 'DRAWING');
ALTER TABLE "PageElement" ALTER COLUMN "type" TYPE "ElementType_new" USING ("type"::text::"ElementType_new");
ALTER TYPE "ElementType" RENAME TO "ElementType_old";
ALTER TYPE "ElementType_new" RENAME TO "ElementType";
DROP TYPE "public"."ElementType_old";
COMMIT;
