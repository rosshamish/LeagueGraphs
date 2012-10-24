<?php
/**
 * Data type conversion functions
 * Created: October 24, 2012 by RossHamish
 */

 function str_to_bool($str) {
    $str = strtolower($str);
    if ($str == 'true') {
        return TRUE;
    } else {
        return FALSE;
    }
 }
 
 function str_to_int($str) {
    return intval($str);
 }
 
?>