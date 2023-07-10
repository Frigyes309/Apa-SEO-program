import { PrismaClient } from "@prisma/client";
const { exceltoPrisma } = require("../../tool/convert");
const prisma = new PrismaClient();

async function insertToDb(objectRepository: any) {
    objectRepository.shift();
    const first = objectRepository[0];
    first.forEach(async (element: any) => {
        let converted = exceltoPrisma(element);

        const resultLP = await prisma.linkedPage.findFirst({
            where: {
                link: converted.link,
            },
        });
        if (resultLP == null) {
            const createdLinkedPage = await prisma.linkedPage.create({
                data: {
                    link: converted.link,
                },
            });
            converted.lpId = createdLinkedPage.id;
        } else {
            converted.lpId = resultLP.id;
        }

        const resultRPM = await prisma.referredPageMain.findFirst({
            where: {
                refpref: converted.refpref,
            },
        });
        if (resultRPM == null) {
            const createdReferredPageMain =
                await prisma.referredPageMain.create({
                    data: {
                        refpref: converted.refpref,
                        dr: converted.dr,
                    },
                });
            converted.refPrefId = createdReferredPageMain.id;
        } else {
            converted.refPrefId = resultRPM.id;
        }

        prisma.domain.create({
            data: {
                raw: converted.raw,
                protocol: converted.protocol,
                refPrefId: converted.refPrefId,
                lpId: converted.lpId,
            },
        });
    });
    //Might need it in the future, but it is garbage information: the last column is the same as the previous one
    //two exact same links could be a problem
}

module.exports = {
    insertToDb: insertToDb,
};
