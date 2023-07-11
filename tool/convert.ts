async function excelToPrisma(objectRepository: any) {
    let converted = {
        lpId: 0, //done
        link: "", //done
        refPrefId: 0, //done
        refPref: "",
        dr: 0, //done
        raw: "",
        protocol: true, //done
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

    console.log(converted);
    return converted;
}

module.exports = {
    excelToPrisma: excelToPrisma,
};
