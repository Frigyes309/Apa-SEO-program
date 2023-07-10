-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "urlName" TEXT NOT NULL,
    "parentDomain" BOOLEAN NOT NULL,
    "domainReferer" BOOLEAN NOT NULL,
    "domainFullReferer" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "refererRating" BOOLEAN NOT NULL,
    "premiumLink" BOOLEAN NOT NULL,
    "premiumReferer" BOOLEAN NOT NULL,
    "premiumLinkReferer" BOOLEAN NOT NULL,
    "junkLink" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
