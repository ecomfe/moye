<?php

require_once __DIR__ . "/lib/Smarty.class.php";

$smarty = new Smarty();

$smarty->left_delimiter = '{%';
$smarty->right_delimiter = '%}';

$smarty->display('./index.tpl');
