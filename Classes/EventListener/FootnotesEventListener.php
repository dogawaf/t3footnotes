<?php

declare(strict_types=1);

namespace CAG\T3footnotes\EventListener;

use CAG\T3footnotes\Service\FootnotesService;
use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Frontend\Event\AfterCacheableContentIsGeneratedEvent;

#[AsEventListener('t3footnotes/content-post-proc')]
readonly class FootnotesEventListener
{
    public function __construct(
        private FootnotesService $footnotesService,
    ) {}

    public function __invoke(AfterCacheableContentIsGeneratedEvent $event): void
    {
        // TSFE->content is marked internal in V13, but currently no substitution exists.
        $event->getController()->content = $this->footnotesService->processContent(
            $event->getController()->content,
            $event->getRequest()
        );
    }
}
