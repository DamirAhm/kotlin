/*
  Warnings:

  - The primary key for the `Gif` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_gifId_fkey";

-- DropForeignKey
ALTER TABLE "_GifToUser" DROP CONSTRAINT "_GifToUser_A_fkey";

-- AlterTable
ALTER TABLE "Gif" DROP CONSTRAINT "Gif_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Gif_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "gifId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_GifToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_gifId_fkey" FOREIGN KEY ("gifId") REFERENCES "Gif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GifToUser" ADD CONSTRAINT "_GifToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Gif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
