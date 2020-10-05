<?
class Encoding {
    public static function ToUTF8($s) {
		    return iconv(mb_detect_encoding($s, mb_detect_order(), true), 'UTF-8', $s);
    }
}

require_once 'index.html';
?>