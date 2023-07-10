const { insertToDb } = require("../db/db");
import * as XLSX from "xlsx";

async function readExcel() {
    const path = "E:\\Ferencnek\\start.xlsx";
    const worksheet =
        XLSX.readFile(path).Sheets[XLSX.readFile(path).SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    //console.log(data[1]);
    insertToDb(data);
}

module.exports = {
    readExcel: readExcel,
};
