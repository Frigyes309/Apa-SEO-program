const { insertToDb } = require("../db/db");
import * as XLSX from "xlsx";

async function readExcel() {
    const path =
        "E:\\Ferencnek\\alapexcelek\\link-check-Ellenorzes_1-2023-05-02-04_30_33.xlsx";
    const worksheet =
        XLSX.readFile(path).Sheets[XLSX.readFile(path).SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    await insertToDb(data);
}

module.exports = {
    readExcel: readExcel,
};
