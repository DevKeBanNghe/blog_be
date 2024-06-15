/*
  Warnings:

  - Added the required column `blog_content` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blog_content" TEXT NOT NULL;
