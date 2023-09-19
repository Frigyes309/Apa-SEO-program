async function excelToPrisma(objectRepository: any) {
    let converted = {
        lpId: 0, //done
        link: "", //done
        refPrefId: 0, //done
        refPref: "",
        dr: 0, //done
        raw: "",
        protocol: true, //done
        anchorId: 0,
        anchor: "",
        titleId: 0,
        title: "",
        anchorEnv : "",
    };
    converted.dr = objectRepository[0];
    converted.link = objectRepository[2];
    converted.protocol = objectRepository[1][4] == "s";

    converted.refPref = objectRepository[1].match(/\/\/([^/]+)/)[1];
    
    const index = objectRepository[1].substring(8).indexOf("/");
    if (index == -1) {
        converted.raw = "";
    } else {
        converted.raw = objectRepository[1].substring(index + 1 + 8);
    }

    converted.anchor = objectRepository[4];
    converted.title = objectRepository[3];

    //this might be a removed link - ask customer
    converted.anchorEnv = objectRepository[5];
    return converted;
}

module.exports = {
    excelToPrisma: excelToPrisma,
};
