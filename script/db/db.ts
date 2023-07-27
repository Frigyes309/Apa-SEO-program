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

async function getDomainDataFromId(id: number) {
    const result = await prisma.domain.findFirst({
        where: {
            id: id,
        },
    });
    if (result != null) {
        const resultLink = await prisma.linkedPage.findFirst({
            where: {
                id: result.lpId,
            },
        });
        const resultReferred = await prisma.referredPageMain.findFirst({
            where: {
                id: result.refPrefId,
            },
        });
        if (resultLink != null && resultReferred != null) {
            const objectRepository = {
                dr: resultReferred.dr,
                from: createFullLink(
                    result.protocol,
                    result.raw,
                    resultReferred.refPref
                ),
                to: resultLink.link,
                redirect: await result.redirect,
                state: await result.state,
            };
            return objectRepository;
        }
    }
    return null;
}

function createFullLink(protocol: boolean, raw: string, refPref: string) {
    if (protocol == true) {
        return "https://" + refPref + "/" + raw;
    } else {
        return "http://" + refPref + "/" + raw;
    }
}

async function getAllLinkRedirectionData() {
    const result = await prisma.domain.findMany({ take: 50 });
    let objectRepository: any = [];
    for (let i = 0; i < result.length; i++) {
        const resultReferred = await prisma.referredPageMain.findFirst({
            where: {
                id: result[i].refPrefId,
            },
        });
        if (resultReferred != null) {
            let objectRepositoryElement = {
                id: result[i].id,
                dr: resultReferred.dr,
                pageType: result[i].isMainPage ? "Főoldal" : "Aloldal",
                linkCount: await prisma.domain.count({
                    where: {
                        id: result[i].id,
                    },
                }),
                category: result[i].category,
                redirectionFrom: resultReferred.refPref,
                redirectionTo: result[i].redirect,
                status: result[i].state,
            };
            objectRepository.push(objectRepositoryElement);
        }
    }
    return objectRepository;
}

async function deleteAllRecords(id: number) {
    prisma.domain.deleteMany();
    prisma.linkedPage.deleteMany();
    prisma.referredPageMain.deleteMany();
}

async function filterByAllLinkRedirection(parameters: any) {
    let resultWhere = {
        redirect: { contains: parameters.redirect },
        state: undefined,
        isMainPage: undefined,
        category: undefined,
    };
    if (parameters.state != 5) {
        resultWhere.state = parameters.state;
    }
    if (parameters.isMainPage != 3) {
        resultWhere.isMainPage = parameters.isMainPage;
    }
    if (parameters.category != 0) {
        resultWhere.category = parameters.category;
    }
    const result = await prisma.domain.findMany({
        take: 50,
        skip: parameters.skip,
        where: resultWhere,
    });
    let objectRepository: any = [];
    for (let i = 0; i < result.length; i++) {
        const resultReferred = await prisma.referredPageMain.findFirst({
            where: {
                id: result[i].refPrefId,
                dr: { gte: parameters.drMin, lte: parameters.drMax },
            },
        });
        if (
            resultReferred != null &&
            (resultReferred.refPref + result[i].raw).includes(
                parameters.fromPage
            )
        ) {
            let objectRepositoryElement = {
                id: result[i].id,
                dr: resultReferred.dr,
                linkCount: await prisma.domain.count({
                    where: {
                        id: result[i].id,
                    },
                }),
                redirectionFrom: resultReferred.refPref,
                redirectionTo: result[i].redirect,
                status: result[i].state,
            };
            objectRepository.push(objectRepositoryElement);
        }
    }
    if (parameters.orderby == "dr") {
        objectRepository.sort((a: any, b: any) => {
            return a.dr - b.dr;
        });
    } else if (parameters.orderby == "linkCount") {
        objectRepository.sort((a: any, b: any) => {
            return a.linkCount - b.linkCount;
        });
    } else if (parameters.orderby == "redirectionFrom") {
        objectRepository.sort((a: any, b: any) => {
            return a.redirectionFrom - b.redirectionFrom;
        });
    } else if (parameters.orderby == "redirectionTo") {
        objectRepository.sort((a: any, b: any) => {
            return a.redirectionTo - b.redirectionTo;
        });
    } else if (parameters.orderby == "status") {
        objectRepository.sort((a: any, b: any) => {
            return a.status - b.status;
        });
    }
    return objectRepository;
}

async function UpdateDomainOnRedirect(id: number, redirect: string) {
    const result = await prisma.domain.update({
        where: {
            id: id,
        },
        data: {
            redirect: redirect,
        },
    });
    return true;
}

module.exports = {
    insertToDb: insertToDb,
    getDomainData: getDomainData,
    getReferredData: getReferredData,
    getLinkData: getLinkData,
    rowCount: rowCount,
    getDomainDataFromId: getDomainDataFromId,
    getAllLinkRedirectionData: getAllLinkRedirectionData,
    deleteAllRecords: deleteAllRecords,
    filterByAllLinkRedirection: filterByAllLinkRedirection,
    UpdateDomainOnRedirect: UpdateDomainOnRedirect,
};
