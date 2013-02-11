<?php

$extensions = array("php", "jpg", "jpeg", "gif", "css", "js", "png");
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$ext = pathinfo($path, PATHINFO_EXTENSION);
if (in_array($ext, $extensions)) {
    // let the server handle the request as-is
    return false; 
} else {
  return file_get_contents('template.html');
}

?>