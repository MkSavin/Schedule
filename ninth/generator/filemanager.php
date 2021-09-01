<?php

/**
 * Copy a file, or recursively copy a folder and its contents
 * @version     1.0.1
 * @param       string   $source    Source path
 * @param       string   $dest      Destination path
 * @param       int      $permissions New folder creation permissions
 * @return      bool     Returns true on success, false on failure
 */
function xcopy($source, $dest, $permissions = 0755)
{
    // Check for symlinks
    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }

    // Simple copy for a file
    if (is_file($source)) {
        return copy($source, $dest);
    }

    // Make destination directory
    if (!is_dir($dest)) {
        mkdir($dest, $permissions);
    }

    // Loop through the folder
    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..') {
            continue;
        }

        // Deep copy directories
        xcopy("$source/$entry", "$dest/$entry", $permissions);
    }

    // Clean up
    $dir->close();
    return true;
}

function _zip($folder, &$zipFile, $exclusiveLength) {

    $handle = opendir($folder);
    while (false !== $f = readdir($handle)) {
        if ($f != '.' && $f != '..') {
            $filePath = $folder . "/" . $f;
            $localPath = substr($filePath, $exclusiveLength);
            if (is_file($filePath)) {
                $zipFile->addFile($filePath, $localPath);
            } else if (is_dir($filePath)) {
                $zipFile->addEmptyDir($localPath);
                _zip($filePath, $zipFile, $exclusiveLength);
            }
        }
    }
    closedir($handle);
}

function zip($folder, $zippath) {
    
    if (!extension_loaded('zip') || !file_exists($folder)) {
        return false;
    }

    $zip = new ZipArchive();
    if (!$zip->open($zippath, ZIPARCHIVE::CREATE)) {
        return false;
    }

    _zip($folder, $zip, strlen("$folder/"));

}

function rmdir_recursive($dir) {
    foreach(scandir($dir) as $file) {
        if ('.' === $file || '..' === $file) continue;
        if (is_dir("$dir/$file")) rmdir_recursive("$dir/$file");
        else unlink("$dir/$file");
    }
    rmdir($dir);
}