import { PrismaClient } from '@prisma/client';
const { excelToPrisma } = require('../../tool/convert');
const prisma = new PrismaClient();

function isMainPage(text: any): boolean {
    const regex = /\//g;
    const matches = text.match(regex);
    return matches ? matches.length === 3 : false;
}

async function insertToDb(objectRepository: any) {
    objectRepository.shift();
    let insertedRows = 0;
    let duplicateRows = 0;

    for (const element of objectRepository) {
        let converted = await excelToPrisma(element);
        let noDuplication = false;
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
            noDuplication = true;
        } else {
            converted.lpId = resultLP.id;
        }
        const resultRPM = await prisma.referredPageMain.findFirst({
            where: {
                refPref: converted.refPref,
            },
        });
        if (resultRPM == null) {
            const createdReferredPageMain = await prisma.referredPageMain.create({
                data: {
                    refPref: converted.refPref,
                    dr: converted.dr,
                },
            });
            converted.refPrefId = createdReferredPageMain.id;
            noDuplication = true;
        } else {
            converted.refPrefId = resultRPM.id;
        }

        const resultAnchor = await prisma.anchor.findFirst({
            where: {
                anchorText: converted.anchor,
                anchorEnvironment: converted.anchorEnv,
            },
        });
        if (resultAnchor == null) {
            const createdAnchor = await prisma.anchor.create({
                data: {
                    anchorText: converted.anchor,
                    anchorEnvironment: converted.anchorEnv,
                },
            });
            converted.anchorId = createdAnchor.id;
            noDuplication = true;
        } else {
            converted.anchorId = resultAnchor.id;
        }

        const resultTitle = await prisma.title.findFirst({
            where: {
                titleText: converted.title,
            },
        });
        if (resultTitle == null) {
            const createdTitle = await prisma.title.create({
                data: {
                    titleText: converted.title,
                },
            });
            converted.titleId = createdTitle.id;
            noDuplication = true;
        } else {
            converted.titleId = resultTitle.id;
        }

        const duplicate = await prisma.domain.findFirst({
            where: {
                raw: converted.raw,
                protocol: converted.protocol,
                refPrefId: converted.refPrefId,
                lpId: converted.lpId,
            },
        });
        if (duplicate == null || noDuplication) {
            await prisma.domain.create({
                data: {
                    raw: converted.raw,
                    protocol: converted.protocol,
                    refPrefId: converted.refPrefId,
                    lpId: converted.lpId,
                    anchorId: converted.anchorId,
                    titleId: converted.titleId,
                },
            });
            insertedRows++;
        } else {
            duplicateRows++;
        }
    }

    console.log(insertedRows + ' rows were inserted');
    console.log(duplicateRows + ' rows were ignored because of duplication');
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

//edit-one
async function getDomainDataFromId(id: number) {
    const result = await prisma.domain.findFirst({
        where: {
            id: id,
        },
    });
    if (result != null) {
        const allSelected = await prisma.domain.findMany({
            where: {
                refPrefId: result.refPrefId,
                lpId: result.lpId,
            },
        });
        let objectRepository: any = [];
        for (const selected of allSelected) {
            const resultReferred = await prisma.referredPageMain.findFirst({
                where: {
                    id: selected.refPrefId,
                },
            });
            const to = await prisma.linkedPage.findFirst({
                where: {
                    id: selected.lpId,
                },
            });
            const category = await prisma.categories.findFirst({
                where: {
                    id: selected.categoryId,
                },
            });
            const anchor = await prisma.anchor.findFirst({
                where: {
                    id: selected.anchorId,
                },
            });
            if (resultReferred != null && to != null) {
                const objectRepositoryElement = {
                    id: selected.id,
                    dr: resultReferred.dr,
                    from: (selected.protocol ? 'https://' : 'http://') + resultReferred.refPref + selected.raw,
                    to: to.link,
                    redirect: selected.redirect,
                    state: selected.state,
                    category: category != null ? category.categoryText : '',
                    anchor: anchor != null ? anchor.anchorText : '',
                    isMainPage: isMainPage(to.link),
                };
                objectRepository.push(objectRepositoryElement);
            }
        }
        return objectRepository;
    }
    return null;
}

function createFullLink(protocol: boolean, raw: string, refPref: string) {
    if (protocol == true) {
        return 'https://' + refPref + '/' + raw;
    } else {
        return 'http://' + refPref + '/' + raw;
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
        const category = await prisma.categories.findFirst({
            where: {
                id: result[i].categoryId,
            },
        });
        if (resultReferred != null) {
            let objectRepositoryElement = {
                id: result[i].id,
                dr: resultReferred.dr,
                //pageType: isMainPage(resultLP?.link) ? "Főoldal" : "Aloldal",
                linkCount: await prisma.domain.count({
                    where: {
                        id: result[i].id,
                    },
                }),
                refererStatus: result[i].refererStatus,
                category: category,
                redirectionFrom: resultReferred.refPref,
                redirectionTo: result[i].redirect,
                status: result[i].state,
            };
            objectRepository.push(objectRepositoryElement);
        }
    }
    return objectRepository;
}

async function deleteAllRecords() {
    await prisma.domain.deleteMany();
    await prisma.linkedPage.deleteMany();
    await prisma.referredPageMain.deleteMany();
    await prisma.anchor.deleteMany();
    await prisma.title.deleteMany();
}

//link-redirection
async function filterByAllLinkRedirection(parameters: any) {
    let takenRefPrefIds: any = [];
    const result = await prisma.domain.findMany({
        where: {
            state: parameters.state != 5 ? parameters.state : undefined,
            refererStatus: parameters.refererStatus == 4 ? undefined : parameters.refererStatus,
            id: parameters.id,
        },
    });
    let objectRepository: any = [];
    for (let i = 0; i < result.length; i++) {
        const resultReferred = await prisma.referredPageMain.findFirst({
            where: {
                id: result[i].refPrefId,
            },
        });
        if (
            resultReferred != null &&
            ((result[i].protocol ? 'https://' : 'http://') + resultReferred.refPref + result[i].raw).includes(
                parameters.fromPage,
            ) &&
            result[i].redirect.includes(parameters.toPage) &&
            resultReferred.dr >= parameters.drMin &&
            resultReferred.dr <= parameters.drMax
        ) {
            const linkCount = await prisma.domain.count({
                where: {
                    refPrefId: result[i].refPrefId,
                    lpId: result[i].lpId,
                },
            });
            const resultLP = await prisma.linkedPage.findFirst({
                where: {
                    id: result[i].lpId,
                },
            });
            const pageType = isMainPage(resultLP?.link) ? 'Főoldal' : 'Aloldal';
            const category = await prisma.categories.findFirst({
                where: {
                    categoryText: parameters.category,
                },
            });
            if (
                linkCount >= parameters.linkCount &&
                !takenRefPrefIds.includes(resultReferred.id + '-' + resultLP?.id) &&
                (parameters.isMainPage == 'Mindegyik' || pageType == parameters.isMainPage) &&
                (parameters.category == 'Mindegyik' || category?.id == result[i].categoryId)
            ) {
                let objectRepositoryElement = {
                    id: result[i].id,
                    dr: resultReferred.dr,
                    linkCount: linkCount,
                    redirectionFrom:
                        (result[i].protocol ? 'https://' : 'http://') + resultReferred.refPref + '/' + result[i].raw,
                    redirectionTo: result[i].redirect,
                    status: result[i].state,
                    isMainPage: pageType,
                    refererStatus: result[i].refererStatus,
                };
                objectRepository.push(objectRepositoryElement);
                takenRefPrefIds.push(resultReferred.id + '-' + resultLP?.id);
            }
        }
    }
    const manipulator = parameters.way == 'ASC' ? 1 : -1;
    if (parameters.orderBy == 'ID') {
        objectRepository = objectRepository.sort((a: any, b: any) => {
            return (a.id - b.id) * manipulator;
        });
    } else if (parameters.orderBy == 'DR') {
        objectRepository = objectRepository.sort((a: any, b: any) => {
            return (a.dr - b.dr) * manipulator;
        });
    } else if (parameters.orderBy == 'linkCount') {
        objectRepository = objectRepository.sort((a: any, b: any) => {
            return (a.linkCount - b.linkCount) * manipulator;
        });
    } else if (parameters.orderBy == 'redirectionFrom') {
        objectRepository = objectRepository.sort((a: any, b: any) => {
            return (a.redirectionFrom - b.redirectionFrom) * manipulator;
        });
    } else if (parameters.orderBy == 'redirectionTo') {
        objectRepository = objectRepository.sort((a: any, b: any) => {
            return (a.redirectionTo - b.redirectionTo) * manipulator;
        });
    }
    return await objectRepository.slice(parameters.skip * 50, parameters.skip * 50 + 50);
}

async function UpdateDomainOnRedirect(id: number, redirect: string, referer: number) {
    const result = await prisma.domain.findFirst({
        where: {
            id: id,
        },
    });
    if (result != null) {
        const result2 = await prisma.domain.updateMany({
            where: {
                refPrefId: result.refPrefId,
                lpId: result.lpId,
            },
            data: {
                redirect: redirect,
                refererStatus: referer,
            },
        });
    } else return false;
    return true;
}

async function DeleteDomainRow(id: number) {
    try {
        const result = await prisma.domain.findFirst({
            where: {
                id: id,
            },
        });
        if (result != undefined) {
            await prisma.domain.deleteMany({
                where: {
                    refPrefId: result.refPrefId,
                    lpId: result.lpId,
                },
            });
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

async function getCategories() {
    const categories = await prisma.categories.findMany({
        select: {
            categoryText: true,
        },
    });
    const categoryTextArray = categories.map((category) => category.categoryText);
    return categoryTextArray;
}

async function addCategory(name: string) {
    const result = await prisma.categories.findFirst({
        where: {
            categoryText: name,
        },
    });
    if (result == null) {
        await prisma.categories.create({
            data: {
                categoryText: name,
            },
        });
        console.log('Category: ' + name + ' was added');
    }
}

async function deleteCategories() {
    await prisma.categories.deleteMany();
}

async function UpdateDomainOnEditOne(id: string, redirect: string, state: string, category: string) {
    const categoryId = await prisma.categories.findFirst({
        where: {
            categoryText: category,
        },
    });
    if (categoryId != null) {
        const result = await prisma.domain.updateMany({
            where: {
                id: Number(id),
            },
            data: {
                redirect: redirect,
                state: state == 'normal' ? 0 : state == 'spam' ? 1 : state == 'premium' ? 2 : 3,
                categoryId: categoryId.id == null ? -1 : categoryId.id,
            },
        });
    } else return false;
    return true;
}

async function getAnchorText() {
    //cat
    //anchor
    //red
    const anchors = await prisma.anchor.findMany({
        select: {
            id: true,
            anchorText: true,
            anchorEnvironment: true,
        },
    });
    let objectRepository: any = [];
    for (const anchor of anchors) {
        const result = await prisma.domain.findFirst({
            where: {
                anchorId: anchor.id,
            },
            select: {
                id: true,
                redirect: true,
                categoryId: true,
                titleId: true,
            },
        });
        if (result != null) {
            const category = await prisma.categories.findFirst({
                where: {
                    id: result.categoryId,
                },
                select: {
                    categoryText: true,
                },
            });
            const title = await prisma.title.findFirst({
                where: {
                    id: result.titleId,
                },
                select: {
                    titleText: true,
                },
            });
            let objectRepositoryElement = {
                redirect: result.redirect,
                category: category?.categoryText ?? '',
                anchor: anchor.anchorText,
                anchorEnvironment: anchor.anchorEnvironment,
                title: title?.titleText ?? '',
            };
            objectRepository.push(objectRepositoryElement);
        }
    }
    return objectRepository;
}

async function getRedirect(url: string) {
    return 'https://www.google.com/';
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
    DeleteDomainRow: DeleteDomainRow,
    getCategories: getCategories,
    addCategory: addCategory,
    deleteCategories: deleteCategories,
    UpdateDomainOnEditOne: UpdateDomainOnEditOne,
    getAnchorText: getAnchorText,
    getRedirect: getRedirect,
};
