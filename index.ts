const { CreateRandom } = require("./test/testDbReliability");
const { Load } = require("./test/testDbReliability");
const { readExcel } = require("./script/middleware/importExcel");
const { getDomainData } = require("./script/db/db");
const { getReferredData } = require("./script/db/db");
const { getLinkData } = require("./script/db/db");
const { rowCount } = require("./script/db/db");
const { getDomainDataFromId } = require("./script/db/db");
const { getAllLinkRedirectionData } = require("./script/db/db");
const { deleteAllRecords } = require("./script/db/db");

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
        numberOfRows: countOfRows,
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
        numberOfRows: countOfRows,
    });
});

app.get("/link-redirection", async (req: any, res: any) => {
    console.log(req.query["DRFrom"]);
    const objectRepository = await getAllLinkRedirectionData();
    Promise.all(objectRepository);
    res.render("linkRedirectionPage", {
        linkData: objectRepository,
    });

    /*const parameters = {
        skip: req.query["skip"] ? req.query["skip"] : 0,
        raw: req.query["raw"] ? req.query["raw"] : "",
        redirect: req.query["redirect"] ? req.query["redirect"] : "",
        state: req.query["state"] ? req.query["state"] : ,
        isMainPage: req.query["isMainPage"] ? req.query["isMainPage"] : ,
        category: req.query["category"] ? req.query["category"] : ,
        refPref: req.query["refPref"] ? req.query["refPref"] : "",
        drMin: req.query["drMin"] ? req.query["drMin"] : 0,
        drMax: req.query["drMax"] ? req.query["drMax"] : 100,
        orderby: req.query["orderby"] ? req.query["orderby"] : "ID",
    }*/
});

app.get("/edit-one/:id", async (req: any, res: any) => {
    const objectRepository = await getDomainDataFromId(req.params["id"]);
    res.render("editOneRedirect", {
        singleInfo: objectRepository,
    });
});

app.get(
    "/delete/nuke-all/yes-i-am-sure-i-want-to-nuke-everything",
    async (req: any, res: any) => {
        Promise.resolve(deleteAllRecords());
        res.render("Everything was nuked.");
    }
);

/*app.get("/load", async (req: any, res: any) => {
});*/

app.listen(port, () => {
  console.log(`Az alkalmazás fut a http://localhost:${port} címen.`);
});
