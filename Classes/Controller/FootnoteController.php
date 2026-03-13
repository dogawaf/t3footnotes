<?php

declare(strict_types=1);

namespace CAG\T3footnotes\Controller;

use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class FootnoteController extends ActionController
{
    /**
     * Action to render the container for t3footnotes, then processed with AfterCacheableContentIsGeneratedEvent.
     */
    protected function listAction(): ResponseInterface
    {
        return $this->htmlResponse();
    }
}
