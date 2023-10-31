const { insertToDb } = require('../db/db');
import * as XLSX from 'xlsx';

async function readExcel(path: string) {
    //const path = "D:\\Apa\\teszt.xlsx";
    const worksheet = XLSX.readFile(path).Sheets[XLSX.readFile(path).SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    await insertToDb(data);
}

module.exports = {
    readExcel: readExcel,
};
