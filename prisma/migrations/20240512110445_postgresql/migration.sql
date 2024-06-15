/*
  Warnings:

  - You are about to drop the column `blog_thumbnaili` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "blog_thumbnaili",
ADD COLUMN     "blog_thumbnail" TEXT;
