<?
// HEADERS
header("Content-type: text/css; charset: UTF-8");
header("Cache-control: public");
header("Cache-control: max-age=86400");

// INPUT
$p = explode(",", $_GET['p']);// PATHS

// USE
require_once "C_CSS.php";

// CONSTANTS
const CSSPATH = "../css/";
const CACHEPATH = CSSPATH."cache/";
const FONTSPATH = "../fonts/";

const MAININDEXFILE = "index.css";

// DECLARATIONS
function DeleteOld($cachefiledir, $f){
	$sc = array_diff(scandir($cachefiledir), ["..", "."]);
	foreach ($sc as $file)
		if(strpos($file, $f)!==FALSE)
			unlink($cachefiledir.$file);
}

function GetMinified($file, $tpl = '', $cacheprefix = ''){
	if(!$tpl || $tpl == '')
		$tpl = CSSPATH;

	if(!file_exists($tpl.$file))
		return "-1";

	$md5 = md5_file($tpl.$file);

	$dir = dirname($file)."/";
	if($dir == "./")
		$dir = "";
	
	$file = basename($file);

	$cachedir = CACHEPATH.$cacheprefix.$dir;

	if(file_exists($cachedir.$md5."-".$file))
		$mincss = file_get_contents($cachedir.$md5."-".$file);
	else {
		if(!is_dir($cachedir))
			mkdir($cachedir, 0777, true);

		DeleteOld($cachedir, $file);

		$mincss = CssMin::minify(file_get_contents($tpl.$dir.$file));
		file_put_contents($cachedir.$md5."-".$file, $mincss);
	}

	return $mincss;
}

// MINIFY FONTS
if(is_dir(FONTSPATH))
foreach (array_diff(scandir(FONTSPATH), [".", ".."]) as $font)
	if(file_exists(FONTSPATH.$font."/".$font.".css"))
		echo GetMinified($font."/".$font.".css", FONTSPATH, "fonts/");

// MINIFY INDEX .CSS
echo GetMinified(MAININDEXFILE);

// MINIFY PAGES
if(!is_array($p))
	$p = [$p];

foreach ($p as $v) {
	$v = trim($v);

	if(!isset($v) || $v == "")
		continue;

	$f = $v.".css";

	if(file_exists(CSSPATH.$f))
		echo GetMinified($f);
}
?>