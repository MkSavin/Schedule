<?php

$studentName = trim(strip_tags($_GET["student-name"])) ?? " ";
$studentGroup = trim(strip_tags($_GET["student-group"])) ?? "ПРИ-117";
$teacherName = trim(strip_tags($_GET["teacher-name"])) ?? " ";
$teacherGroup = trim(strip_tags($_GET["teacher-group"])) ?? " ";
$discipline = trim(strip_tags($_GET["discipline"])) ?? " ";
$workNumber = intval($_GET["work-number"]) ?? 1;
$city = trim(strip_tags($_GET["city"])) ?? "Владимир";
$year = intval($_GET["year"]) ?? date('Y');

$root = str_replace('\\', '/', dirname(__FILE__));

include 'filemanager.php';

$hash = md5($studentName . "!-=" . $studentGroup . "!-=" . $teacherName . "!-=" . $teacherGroup . "!-=" . $discipline . "!-=" . $workNumber . "!-=" . $city . "!-=" . $year);

$cRoot = $root . '/cache/' . $hash;

if (!is_dir($cRoot) || !file_exists($cRoot . ".docx")) {

    if (is_dir($cRoot)) {
        rmdir($cRoot);
    }

    xcopy($root . '/template', $cRoot);

    $document = $cRoot . "/word/document.xml";

    $documentData = file_get_contents($document);

    $replaceData = [
        "%DISCIPLINE%" => $discipline,
        "%WNUM%" => $workNumber,
        "%STNAME%" => $studentName,
        "%STGROUP%" => $studentGroup,
        "%TEANAME%" => $teacherName,
        "%TEAGROUP%" => $teacherGroup,
        "%YEAR%" => $year,
        "%CITY%" => $city,
    ];

    $documentData = str_replace(array_keys($replaceData), array_values($replaceData), $documentData);

    file_put_contents($document, $documentData);

    zip($cRoot, $cRoot . '.zip');

    rename($cRoot . '.zip', $cRoot . '.docx');

    chmod($cRoot . '.docx', 0644);

}

echo json_encode([
    "status" => "ok",
    "file" => str_replace($_SERVER['DOCUMENT_ROOT'], '', str_replace('\\', '/', $cRoot)) . '.docx',
    "filfe" => $_SERVER['DOCUMENT_ROOT'],
    "loadname" => $studentGroup . "-" . $discipline . "#" . $workNumber . "-" . $studentName . ".docx",
]);