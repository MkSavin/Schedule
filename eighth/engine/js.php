<?
header("Content-type: text/javascript; charset: UTF-8");
header("Cache-control: public");
header("Cache-control: max-age=2592000");

$p = $_GET['p'];//PATH

$p = explode(',', $p);

$tpl = "../js/";

foreach ($p as $v)
	echo file_get_contents($tpl.$v.'.js').';';

?>