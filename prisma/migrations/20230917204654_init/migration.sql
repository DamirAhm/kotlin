-- CreateTable
CREATE TABLE "User" (
    "vkId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("vkId")
);

-- CreateTable
CREATE TABLE "Gif" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Gif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gifId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GifToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GifToUser_AB_unique" ON "_GifToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GifToUser_B_index" ON "_GifToUser"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("vkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_gifId_fkey" FOREIGN KEY ("gifId") REFERENCES "Gif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GifToUser" ADD CONSTRAINT "_GifToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Gif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GifToUser" ADD CONSTRAINT "_GifToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("vkId") ON DELETE CASCADE ON UPDATE CASCADE;
