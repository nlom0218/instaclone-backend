/*
  Warnings:

  - A unique constraint covering the columns `[photoId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like.photoId_userId_unique" ON "Like"("photoId", "userId");
