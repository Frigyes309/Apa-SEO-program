<?php

require 'vendor/autoload.php';

use Prisma\PrismaClient;

$client = new PrismaClient([
  'dsn' => 'postgres://postgres:postgresql@localhost:9513/seodb'
]);

header("Expires: 0");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$domain = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

$string = 'https://example.com/path/to/file.txt';
$new_string = preg_replace('/^.{7}(.*?)/', '$1', $string);



// Fetch the redirection information for the current domain
$found_domain = $client->domain->findFirst({
  where: {
    raw: $domain,
  },
});

$found_refpref = $client->refpref->findFirst({
  where: {
	id: $found_domain->refpref_id,
  },
  select: {
	refPref: true,
  },
});

$full_domain = ($found_domain->protocol ? "https://" : "http://") + $found_refpref->refPref + "/" + $found_domain->domain;


if ($found_domain == $domain) {
  // Redirect the user to the new domain
  /*$found_linked_page = $client->linked_page->findFirst({
	where: {
	  id: $found_domain->lpId,
	},
  });*/
  header("HTTP/1.1 301 Moved Permanently");
  header("Location: " . $found_domain->redirect);
} else {
  // No redirection information found
  // Display a 404 error page or something else
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
</body>
</html>
