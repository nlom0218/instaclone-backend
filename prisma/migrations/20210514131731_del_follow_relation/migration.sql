/*
  Warnings:

  - You are about to drop the `_FollowRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FollowRelation" DROP CONSTRAINT "_FollowRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_FollowRelation" DROP CONSTRAINT "_FollowRelation_B_fkey";

-- DropTable
DROP TABLE "_FollowRelation";
