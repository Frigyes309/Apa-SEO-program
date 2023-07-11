const { CreateRandom } = require("./test/testDbReliability");
const { Load } = require("./test/testDbReliability");
const { readExcel } = require("./script/middleware/importExcel");
const { getDomainData } = require("./script/db/db");
const { getReferredData } = require("./script/db/db");
const { getLinkData } = require("./script/db/db");

const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.get("/create", async (req: any, res: any) => {
    readExcel();
});

app.get("/", (req: any, res: any) => {
    res.render("firstShowcase", {
        domainData: getDomainData(),
        referredData: getReferredData(),
        linkData: getLinkData(),
    });
});

/*app.get("/load", async (req: any, res: any) => {
});*/

app.listen(port, () => {
  console.log(`Az alkalmazás fut a http://localhost:${port} címen.`);
});
