<?php
require 'prisma/generated/client/index.php';

header("Expires: 0");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$domain = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

$prisma = new PrismaClient();

$referer = $_SERVER['HTTP_REFERER'];

if (isset($referer) && !empty($referer)) {
    $refererDomain = parse_url($referer);
    $domains = $prisma->domain->findMany([
        'where' => [
            'UrlName' => [
                'startsWith' => $domain,
            ],
            'DomainReferer' => [
                'contains' => $refererDomain['host'],
            ],
            'Domain' => [
                'not' => '',
            ],
        ],
    ]);

    if ($domains) {
        header("HTTP/1.1 301 Moved Permanently");
        header("Location: " . $domains[0]->Domain);
    }
} else {
    $domains = $prisma->domain->findMany([
        'where' => [
            'UrlName' => [
                'startsWith' => $domain,
            ],
            'Domain' => [
                'not' => '',
            ],
        ],
    ]);

    if ($domains) {
        header("HTTP/1.1 301 Moved Permanently");
        header("Location: " . $domains[0]->Domain);
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
</head>
<body>
<!-- statuscheck -->
</body>
</html>
