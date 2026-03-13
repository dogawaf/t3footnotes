<?php

declare(strict_types=1);

use CAG\T3footnotes\Controller\FootnoteController;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

defined('TYPO3') || die();

ExtensionUtility::configurePlugin(
    'T3footnotes',
    'List',
    [FootnoteController::class => 'list'],
    [],
    ExtensionUtility::PLUGIN_TYPE_CONTENT_ELEMENT
);
