const { getReferredPageMain } = require("../db/db");
const { getCountOfLink } = require("../db/db");

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
        //? Ki tudja, hogy erre gondolt-e a költő
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

/*
<th>Id</th>
                        <th>DR</th>
                        <th>Linkek száma</th>
                        <th>Referer</th>
                        <option value="1">Biztosan van</option> <!-- Színezni -->
                        <option value="2">Nem megállapítható</option>
                        <option value="3">Nem vizsgált</option>
                        <option value="4">Nincs</option>
                        
                        <th>Ment</th>
                        <th>Belemegy</th>
                        <th>Másol</th>
                        <th>Kivesz</th>*/
