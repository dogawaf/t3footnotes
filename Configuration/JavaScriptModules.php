<?php

declare(strict_types=1);

return [
    'dependencies' => [
        'ckeditor',
    ],
    'tags' => [
        'backend.form',
    ],
    'imports' => [
        // register our module for ckeditor5 plugin, registered in RTE/Plugin.yaml
        '@cag/t3footnotes' => 'EXT:t3footnotes/Resources/Public/JavaScript/CKEditor5/t3footnotes.js',
        '@cag/t3footnotes/translations' => 'EXT:t3footnotes/Resources/Public/JavaScript/CKEditor5/translations.js',
    ],
];
