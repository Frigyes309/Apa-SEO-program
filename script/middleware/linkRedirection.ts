const { getReferredPageMain } = require('../db/db');
const { getCountOfLink } = require('../db/db');

async function getRows() {
    let objectRepository: {
        id: any;
        dr: any;
        linkCount: any;
        referer: any;
        status: number;
    }[] = [];
    const domain = await getDomainData();
    domain.forEach((element: any) => {
        const ref = getReferredPageMain(element.refPrefId);
        const link = getLinkData(element.lpId);
        let dataType = {
            id: element.id,
            dr: ref.sr,
            linkCount: getCountOfLink(element.lpId),
            referer: ref.refPref,
            status: 0,
        };

        objectRepository.push(dataType);
    });
    return objectRepository;
}

module.exports = {
    getRows: getRows,
};
