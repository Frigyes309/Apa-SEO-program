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
const { UpdateDomainOnRedirect } = require("./script/db/db");
const { DeleteDomainRow } = require("./script/db/db");

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
    let drMin = Number(req.query["DRFrom"]);
    let drMax = Number(req.query["DRTo"]);
    let lc = req.query["linkCount"];
    if (drMin > drMax) {
        const temp = drMin;
        drMin = drMax;
        drMax = temp;
        if (drMin < 0) {
            drMin = 0;
        }
        if (drMax > 100) {
            drMax = 100;
        }
    }
    if (lc < 1) {
        lc = 1;
    }
    const parameters = {
        skip: req.query["skip"] ? req.query["skip"] : 0,
        redirect: req.query["redirectionTo"] ? req.query["redirectionTo"] : "",
        state: req.query["state"] ? req.query["state"] : 5,
        isMainPage: req.query["isMainPage"] ? req.query["isMainPage"] : 3,
        category: req.query["category"] ? req.query["category"] : 0,
        drMin: drMin ? drMin : 0,
        drMax: drMax ? drMax : 100,
        fromPage: req.query["redirectionFrom"]
            ? req.query["redirectionFrom"]
            : "",
        orderby: req.query["orderBy"] ? req.query["orderBy"] : "ID",
    };
    const filteredObjectRepository = {
        drf: drMin ? drMin : "",
        drt: drMax ? drMax : "",
        lc: lc ? lc : "",
        rf: req.query["redirectionFrom"] ? req.query["redirectionFrom"] : "",
        rt: req.query["redirectionTo"] ? req.query["redirectionTo"] : "",
        rs: req.query["refererStatus"] ? req.query["refererStatus"] : "",
        pageType: req.query["pageType"] ? req.query["pageType"] : "Mindegyik",
        category: req.query["category"] ? req.query["category"] : "Mindegyik",
        ob: req.query["orderBy"] ? req.query["orderBy"] : "ID",
    };
    if (req.query["dataId"] != undefined) {
        await UpdateDomainOnRedirect(
            Number(req.query["dataId"]),
            req.query["dataString"],
            Number(req.query["dataReferer"])
        );
    }
    if (req.query["deleteId"] != undefined) {
        await DeleteDomainRow(Number(req.query["deleteId"]));
    }
    const objectRepository = await getAllLinkRedirectionData();
    Promise.all(objectRepository);
    res.render("linkRedirectionPage", {
        linkData: objectRepository,
        filter: filteredObjectRepository,
        categories: ["Kategória1"],
    });
});

app.get("/edit-one/:id", async (req: any, res: any) => {
    const objectRepository = await getDomainDataFromId(
        Number(req.params["id"])
    );
    res.render("editOneRedirect", {
        singleInfo: objectRepository,
        //linkData: objectRepository,
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
