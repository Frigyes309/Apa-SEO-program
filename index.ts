const { CreateRandom } = require('./test/testDbReliability');
const { Load } = require('./test/testDbReliability');
const { readExcel } = require('./script/middleware/importExcel');
const { getDomainData } = require('./script/db/db');
const { getReferredData } = require('./script/db/db');
const { getLinkData } = require('./script/db/db');
const { rowCount } = require('./script/db/db');
const { getDomainDataFromId } = require('./script/db/db');
const { getAllLinkRedirectionData } = require('./script/db/db');
const { deleteAllRecords } = require('./script/db/db');
const { UpdateDomainOnRedirect } = require('./script/db/db');
const { DeleteDomainRow } = require('./script/db/db');
const { filterByAllLinkRedirection } = require('./script/db/db');
const { getCategories } = require('./script/db/db');
const { addCategory } = require('./script/db/db');
const { deleteCategories } = require('./script/db/db');
const { UpdateDomainOnEditOne } = require('./script/db/db');
const { getAnchorText } = require('./script/db/db');

const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.get('/create', async (req: any, res: any) => {
    await readExcel();
    res.render('createPage');
});

app.get('/', async (req: any, res: any) => {
    const domain = await getDomainData();
    const referred = await getReferredData();
    const link = await getLinkData();
    const countOfRows = await rowCount();
    res.render('firstShowcase', {
        domainData: domain,
        referredData: referred,
        linkData: link,
        numberOfRows: countOfRows,
    });
});

app.get('/data', async (req: any, res: any) => {
    const domain = await getDomainData();
    const referred = await getReferredData();
    const link = await getLinkData();
    const countOfRows = await rowCount();
    res.render('firstShowcase', {
        domainData: domain,
        referredData: referred,
        linkData: link,
        numberOfRows: countOfRows,
    });
});

app.get('/link-redirection', async (req: any, res: any) => {
    let id =
        req.query['id'] != undefined && req.query['id'] != '' && Number(req.query['id']) != 0
            ? Number(req.query['id'])
            : undefined;
    let drMin = Number(req.query['DRFrom']);
    let drMax = Number.isNaN(parseInt(req.query['DRTo'])) ? 100 : Number(req.query['DRTo']);
    let lc = req.query['linkCount'];
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
        skip: req.query['skip'] != undefined ? req.query['skip'] - 1 : 0,
        redirect: req.query['redirectionTo'] != undefined ? req.query['redirectionTo'] : '',
        state: req.query['state'] != undefined ? req.query['state'] : 5,
        refererStatus: req.query['refererStatus'] != undefined ? Number(req.query['refererStatus']) : 4,
        isMainPage:
            req.query['pageType'] == 'Főoldal'
                ? 'Főoldal'
                : req.query['pageType'] == 'Aloldal'
                ? 'Aloldal'
                : 'Mindegyik',
        linkCount: lc != undefined ? lc : 1,
        category: req.query['category'] != undefined ? req.query['category'] : 'Mindegyik',
        drMin: drMin != undefined ? drMin : 0,
        drMax: drMax != undefined ? drMax : 100,
        fromPage: req.query['redirectionFrom'] != undefined ? req.query['redirectionFrom'] : '',
        toPage: req.query['redirectionTo'] != undefined ? req.query['redirectionTo'] : '',
        orderBy: req.query['orderBy'] != undefined ? req.query['orderBy'] : 'ID',
        way: req.query['way'] != undefined ? req.query['way'] : 'ASC',
        id: id,
    };
    const filteredObjectRepository = {
        drf: drMin != undefined ? drMin : 0,
        drt: drMax != undefined ? drMax : 100,
        lc: lc != undefined ? lc : 1,
        rf: req.query['redirectionFrom'] != undefined ? req.query['redirectionFrom'] : '',
        rt: req.query['redirectionTo'] != undefined ? req.query['redirectionTo'] : '',
        rs: req.query['refererStatus'] != undefined ? req.query['refererStatus'] : '',
        pageType:
            req.query['pageType'] == 'Főoldal'
                ? 'Főoldal'
                : req.query['pageType'] == 'Aloldal'
                ? 'Aloldal'
                : 'Mindegyik',
        category: req.query['category'] != undefined ? req.query['category'] : 'Mindegyik',
        ob: req.query['orderBy'] != undefined ? req.query['orderBy'] : 'ID',
        pageNumber: req.query['skip'] != undefined ? req.query['skip'] : 1,
        way: req.query['way'] != undefined ? req.query['way'] : 'ASC',
        id: id,
    };
    if (req.query['dataId'] != undefined) {
        await UpdateDomainOnRedirect(
            Number(req.query['dataId']),
            req.query['dataString'],
            Number(req.query['dataReferer']),
        );
    }
    if (req.query['deleteId'] != undefined) {
        await DeleteDomainRow(Number(req.query['deleteId']));
    }
    const objectRepository = await filterByAllLinkRedirection(parameters);
    Promise.all(objectRepository);
    res.render('linkRedirectionPage', {
        linkData: objectRepository,
        filter: filteredObjectRepository,
        categories: await getCategories(),
        loaded: (Boolean)(req.query['loaded']),
    });
});

app.get('/edit-one/:id', async (req: any, res: any) => {
    const objectRepository = await getDomainDataFromId(Number(req.params['id']));
    //console.log(objectRepository);
    res.render('editOneRedirect', {
        singleInfo: objectRepository,
        categories: await getCategories(),
    });
});

app.post('/edit-one/:id/add-category/:newCategory', async (req: any, res: any) => {
    addCategory(req.params['newCategory']);
    res.redirect('/edit-one/' + req.params['id']);
});

app.post('/edit-one/:id/save/:redirect/:state/:category', async (req: any, res: any) => {
    await UpdateDomainOnEditOne(req.params['id'], req.params['redirect'], req.params['state'], req.params['category']);
    res.redirect('/edit-one/' + req.params['id']);
});

app.get('/anchor', async (req: any, res: any) => {
    const domain = await getDomainData();
    const referred = await getReferredData();
    const link = await getLinkData();
    const countOfRows = await rowCount();
    res.render('anchor', {
        anchorInfo: await getAnchorText(),
        categories: await getCategories(),
    });
});

app.get('/nuke-all/yes-i-am-sure-i-want-to-nuke-everything', async (req: any, res: any) => {
    Promise.resolve(deleteAllRecords());
    console.log('done');
    res.send('Everything was nuked.');
});

app.get('/resetCategories', async (req: any, res: any) => {
    await deleteCategories();
    await addCategory('Kategória1');
    res.redirect('/link-redirection');
});

app.listen(port, () => {
    console.log(`Az alkalmazás fut a http://localhost:${port} címen.`);
});
