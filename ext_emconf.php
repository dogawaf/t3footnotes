<?php

declare(strict_types=1);

$EM_CONF[$_EXTKEY] = [
    'title' => 'RTE footnotes and references',
    'description' => "TYPO3 extension to add footnotes to TYPO3's integrated RTE CKEditor 5",
    'category' => 'misc',
    'author' => 'Jochen Rieger',
    'author_email' => 'j.rieger@connecta.ag',
    'state' => 'beta',
    'version' => '1.3.0',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-13.4.99',
            'rte_ckeditor' => '13.4.0-13.4.99',
        ],
        'conflicts' => [
        ],
        'suggests' => [
        ],
    ],
];
