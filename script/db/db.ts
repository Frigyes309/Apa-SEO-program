import { PrismaClient } from "@prisma/client";
const { excelToPrisma } = require("../../tool/convert");
const prisma = new PrismaClient();

/*async function insertToDb(objectRepository: any) {
    objectRepository.shift();
    let insertedRows = 0;
    let duplicateRows = 0;
    await Promise.all(
        objectRepository.map(async (element: any) => {
            objectRepository.forEach(async (element: any) => {
                let converted = await excelToPrisma(element);
                console.log("Running1");
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

                console.log("Running2");
                const resultRPM = await prisma.referredPageMain.findFirst({
                    where: {
                        refPref: converted.refpref,
                    },
                });
                if (resultRPM == null) {
                    const createdReferredPageMain =
                        await prisma.referredPageMain.create({
                            data: {
                                refPref: converted.refPref,
                                dr: converted.dr,
                            },
                        });
                    converted.refPrefId = createdReferredPageMain.id;
                } else {
                    converted.refPrefId = resultRPM.id;
                }

                console.log("Running3");
                const duplicate = await prisma.domain.findFirst({
                    where: {
                        raw: converted.raw,
                        protocol: converted.protocol,
                        refPrefId: converted.refPrefId,
                        lpId: converted.lpId,
                    },
                });
                if (duplicate == null) {
                    await prisma.domain.create({
                        data: {
                            raw: converted.raw,
                            protocol: converted.protocol,
                            refPrefId: converted.refPrefId,
                            lpId: converted.lpId,
                        },
                    });
                    insertedRows++;
                } else {
                    duplicateRows++;
                }
                console.log("something happened");
            });

            // Return a promise that resolves when the domain is created or ignored
            return duplicate == null
                ? prisma.domain.create({
                      data: {
                          raw: converted.raw,
                          protocol: converted.protocol,
                          refPrefId: converted.refPrefId,
                          lpId: converted.lpId,
                      },
                  })
                : Promise.resolve();
        })
    );
    console.log(insertedRows + " rows were inserted");
    console.log(duplicateRows + " rows were ignored inserted");
}*/

async function insertToDb(objectRepository: any) {
    objectRepository.shift();
    let insertedRows = 0;
    let duplicateRows = 0;

    await Promise.all(
        objectRepository.map(async (element: any) => {
            let converted = await excelToPrisma(element);
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
                    refPref: converted.refpref,
                },
            });
            if (resultRPM == null) {
                const createdReferredPageMain =
                    await prisma.referredPageMain.create({
                        data: {
                            refPref: converted.refPref,
                            dr: converted.dr,
                        },
                    });
                converted.refPrefId = createdReferredPageMain.id;
            } else {
                converted.refPrefId = resultRPM.id;
            }

            const duplicate = await prisma.domain.findFirst({
                where: {
                    raw: converted.raw,
                    protocol: converted.protocol,
                    refPrefId: converted.refPrefId,
                    lpId: converted.lpId,
                },
            });
            if (duplicate == null) {
                await prisma.domain.create({
                    data: {
                        raw: converted.raw,
                        protocol: converted.protocol,
                        refPrefId: converted.refPrefId,
                        lpId: converted.lpId,
                    },
                });
                insertedRows++;
            } else {
                duplicateRows++;
            }
        })
    );

    console.log(insertedRows + " rows were inserted");
    console.log(duplicateRows + " rows were ignored because of duplication");
}

async function getDomainData() {
    const result = await prisma.domain.findMany();
    return result;
}

async function getReferredData() {
    const result = await prisma.referredPageMain.findMany();
    return result;
}

async function getLinkData() {
    const result = await prisma.linkedPage.findMany();
    return result;
}

async function rowCount() {
    const result = await prisma.domain.count();
    return result;
}

module.exports = {
    insertToDb: insertToDb,
    getDomainData: getDomainData,
    getReferredData: getReferredData,
    getLinkData: getLinkData,
    rowCount: rowCount,
};
