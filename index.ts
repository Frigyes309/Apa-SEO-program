const { CreateRandom } = require("./test/testDbReliability");
const { Load } = require("./test/testDbReliability");
const { readExcel } = require("./script/middleware/importExcel");
const { getDomainData } = require("./script/db/db");
const { getReferredData } = require("./script/db/db");
const { getLinkData } = require("./script/db/db");
const { rowCount } = require("./script/db/db");

const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.get("/create", async (req: any, res: any) => {
    await readExcel();
    res.render("createPage");
});

app.get("/", async (req: any, res: any) => {
    const domain = await getDomainData();
    const referred = await getReferredData();
    const link = await getLinkData();
    const countOfRows = await rowCount();
    res.render("firstShowcase", {
        domainData: domain,
        referredData: referred,
        linkData: link,
        countOfRows: countOfRows,
    });
});

app.get("/data", async (req: any, res: any) => {
    
    const domain = await getDomainData();
    const referred = await getReferredData();
    const link = await getLinkData();
    const countOfRows = await rowCount();
    res.render("firstShowcase", {
        domainData: domain,
        referredData: referred,
        linkData: link,
        countOfRows: countOfRows,
    });
});

/*app.get("/load", async (req: any, res: any) => {
});*/

app.listen(port, () => {
  console.log(`Az alkalmazás fut a http://localhost:${port} címen.`);
});
