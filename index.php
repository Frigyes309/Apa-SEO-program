<?php 
header("Expires: 0");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$domain = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

$servername = "79.172.241.103:3306";
$username = "cikkelp";
$password = "pvVUS7dw2q6t";


try {
    //$conn = new PDO("mysql:host=$servername;dbname=cikkelp_admin;charset=utf8", $username, $password);
    //$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $referer = $_SERVER['HTTP_REFERER'];
    $prisma = new PrismaClient();

	if ( isset($referer) && !empty($referer) ) {
		$refererDomain = parse_url($referer);
		//$stmt = $conn->prepare("SELECT * FROM seo__linkredomain WHERE 
		//UrlName LIKE ? AND DomainReferer LIKE ? AND Domain NOT LIKE ? ");
		$domains = $prisma->domain.findMany({
			where: {
				UrlName: {
					startsWith: $domain,
				},
				DomainReferer: {
					contains: $refererDomain['host'],
				},
				Domain: {
					notContains: "",
				},
			},
		});
		//$stmt->execute([$domain, "%".$refererDomain['host']."%", ""]); 
		//$domains = $stmt->fetchAll();
		if ( $domains ) {

			header("HTTP/1.1 301 Moved Permanently"); 
			header("Location: ".$domains[0]['Domain']); 
		}
	} else {
		
		/*$stmt = $conn->prepare("SELECT * FROM seo__linkredomain WHERE UrlName LIKE ? AND Domain NOT LIKE ? ");
	    $stmt->execute([$domain, ""]); 
		$domains = $stmt->fetchAll();*/
		$domains = $prisma->domain.findMany({
			where: {
				UrlName: {
					startsWith: $domain,
				},
				Domain: {
					notContains: "",
				},
			},
		});

		if ( $domains ) {
			header("HTTP/1.1 301 Moved Permanently"); 
			header("Location: ".$domains[0]['Domain']); 
		}
	}

    $conn = null;
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
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