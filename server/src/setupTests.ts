import { beforeEach, afterAll } from '@jest/globals';
import prisma from "./prisma/prisma";

beforeEach(async () => {
    await prisma.logEvent.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});