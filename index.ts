const { CreateRandom } = require("./test/testDbReliability");
const { Load } = require("./test/testDbReliability");

const express = require("express");
const app = express();
const port = 3000;

app.get("/create", async (req: any, res: any) => {
  const objectRepository = {
    id: 1,
    url: "test",
    urlReferer: "test",
    parentDomain: "test",
    domainReferer: "test",
    domainFullReferer: "test",
    domain: "test",
    linkReferer: true,
    refererRating: false,
    premiumLink: false,
    premiumReferer: false,
    premiumLinkReferer: false,
    junkLink: false,
  };
  try {
    await CreateRandom(objectRepository);
    res.send("Random record created successfully!");
  } catch (error) {
    console.error("Error creating random record:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.get("/load", async (req: any, res: any) => {
  const id = 1;
  const row = await Load(id);
  res.send(row);
});

app.listen(port, () => {
  console.log(`Az alkalmazás fut a http://localhost:${port} címen.`);
});
