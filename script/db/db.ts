//const { PrismaClient } = require("@prisma/client");

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function insertToDb(onjectRepository: any) {
    
}

module.exports = {
    InsertToDb: insertToDb,
};
