-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blog_thumbnaili" TEXT;

-- CreateTable
CREATE TABLE "Tag" (
    "tag_id" SERIAL NOT NULL,
    "tag_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "blog_id" INTEGER,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tag_id")
);
