const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createRandom(objectRepository: any) {
    /*const new_id = objectRepository.id;
  const new_urlName = objectRepository.url; //TODO
  const new_parentDomain =
    objectRepository.domainFullReferer.substring(0, 4) == "www." ? true : false;
  const new_domainReferer =
    objectRepository.domainFullReferer[4] == "s"
      ? objectRepository.domainReferer[4] == "s"
      : !(objectRepository.domainReferer[4] == "s");
  const new_domainFullReferer = objectRepository.domainFullReferer;
  const new_domain = objectRepository.domain;
  const new_refererRating = objectRepository.refererRating;
  const new_premiumLink = objectRepository.premiumLink;
  const new_premiumReferer = objectRepository.premiumReferer;
  const new_premiumLinkReferer = objectRepository.premiumLinkReferer;
  const new_junkLink = objectRepository.junkLink;
  const random = await prisma.user.create({
    data: {
      id: new_id,
      urlName: new_urlName,
      parentDomain: new_parentDomain,
      domainReferer: new_domainReferer,
      domainFullReferer: new_domainFullReferer,
      domain: new_domain,
      refererRating: new_refererRating,
      premiumLink: new_premiumLink,
      premiumReferer: new_premiumReferer,
      premiumLinkReferer: new_premiumLinkReferer,
      junkLink: new_junkLink,
    },
  });*/
}

async function load() {
    /*const row = prisma.user.findUnique({
    where: { id: 1 },
  });
  return row;*/
}

module.exports = {
    /*CreateRandom: createRandom,
  Load: load,*/
};
