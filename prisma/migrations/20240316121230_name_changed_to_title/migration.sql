/*
  Warnings:

  - You are about to drop the column `name` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `section` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `section` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `title` VARCHAR(191) NULL;
