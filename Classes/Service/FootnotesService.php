<?php

declare(strict_types=1);

namespace CAG\T3footnotes\Service;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\View\ViewFactoryData;
use TYPO3\CMS\Core\View\ViewFactoryInterface;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;

class FootnotesService
{
    private const MARKER_FOOTNOTES = '###FOOTNOTES###';

    private const MARKER_FOOTNOTES_START = '###FOOTNOTES_START###';

    private const MARKER_FOOTNOTES_END = '###FOOTNOTES_END###';

    private const MARKER_FOOTNOTE_ANCHOR_NR = '{n}';

    private array $config;

    public function __construct(
        private readonly ConfigurationManagerInterface $configurationManager,
        private readonly ViewFactoryInterface $viewFactory,
    ) {
        $this->config = $this->configurationManager->getConfiguration(
            $this->configurationManager::CONFIGURATION_TYPE_FRAMEWORK,
            't3footnotes'
        );
    }

    public function processContent(string $content, ServerRequestInterface $request): string
    {
        if (!str_contains($content, self::MARKER_FOOTNOTES_START)) {
            return $content;
        }

        // init vars
        $patternFootnoteAnchors = '/<sup\s+class="t3foonote">(?:.(?!\<\/sup\>))*.<\/sup>/i';
        $patternFootnoteAnchorDataAttr = '/(<span\s+class="t3foonotes-anchor-data".*?>)((?:.(?!\<\/span\>))*.)(<\/span>)/i';
        $patternFootnoteAnchorLink = '/(<a.*?class="t3foonotes-anchor".*?>)((?:.(?!\<\/a\>))*.)(<\/a>)/i';

        $hrefPattern = '/(href=".*?")/i';

        $tempMarkerAnchor = '#########SUP#########';
        $patterntempMarkerAnchor = '/' . $tempMarkerAnchor . '/';
        $matchesFootnoteData = [];
        $footnotes = [];

        preg_match_all($patternFootnoteAnchors, $content, $matchesFootnotesAnchors, PREG_PATTERN_ORDER);
        $footnoteAnchors = $matchesFootnotesAnchors[0] ?? [];

        // if found footnotes anchors process build footnotes
        if ($footnoteAnchors === []) {
            return $this->replaceFootnotesContainer($content, '');
        }

        // replace all anchors by temp marker
        $content = preg_replace($patternFootnoteAnchors, $tempMarkerAnchor, $content);

        $nr = 1;
        $limitTempMarkerAnchor = 1;

        foreach ($footnoteAnchors as $footnoteAnchor) {
            // get footnote text and remove data span
            preg_match($patternFootnoteAnchorDataAttr, $footnoteAnchor, $matchesFootnoteData);
            preg_match($patternFootnoteAnchorLink, $footnoteAnchor, $matchesFootnoteLink);

            // build only valid anchors with anchor link and content
            if (count($matchesFootnoteData) === 4 && count($matchesFootnoteLink) === 4) {
                $footnoteContent = $matchesFootnoteData[2];

                $footnotes[] = ['data' => $footnoteContent, 'nr' => $nr];
                $footnoteAnchor = preg_replace($patternFootnoteAnchorDataAttr, '', $footnoteAnchor);

                $hrefToReplace = 'href="#fn-content-' . self::MARKER_FOOTNOTE_ANCHOR_NR . '"';

                // set the right anchor link
                $footnoteAnchor = preg_replace($hrefPattern, $hrefToReplace, $footnoteAnchor);

                // set anchor numbers
                $footnoteAnchor = str_replace(
                    [self::MARKER_FOOTNOTE_ANCHOR_NR, urlencode(self::MARKER_FOOTNOTE_ANCHOR_NR)],
                    [(string) $nr],
                    $footnoteAnchor
                );

                $nr++;
            } else {
                $footnotes[] = ['data' => '', 'nr' => 0];
                $footnoteAnchor = '';
            }

            // replace the first (current) temp anchor marker in content by modified footnote anchor
            $content = preg_replace($patterntempMarkerAnchor, $footnoteAnchor, $content, $limitTempMarkerAnchor);
        }

        $containerFootnotes = $this->buildFootnotesContainer($footnotes, $content, $request);

        return $this->replaceFootnotesContainer($content, $containerFootnotes);
    }

    private function replaceFootnotesContainer(string $content, string $containerFootnotes): string
    {
        $patternReplaceContainer = '/' . self::MARKER_FOOTNOTES_START . '[\w\W]*(?=' . self::MARKER_FOOTNOTES_END . ')' . self::MARKER_FOOTNOTES_END . '/';

        return preg_replace($patternReplaceContainer, $containerFootnotes, $content);
    }

    private function buildFootnotesContainer(array $footnotes, string $content, ServerRequestInterface $request): string
    {
        if ($footnotes === []) {
            return '';
        }

        $containerFootnotes = '';
        $patternContainer = '/(' . self::MARKER_FOOTNOTES_START . ')([\w\W]*)(?=' . self::MARKER_FOOTNOTES_END . ')(' . self::MARKER_FOOTNOTES_END . ')/';
        preg_match($patternContainer, $content, $matches_container);

        if (count($matches_container) === 4) {
            $containerFootnotes = $matches_container[2];
            $footnotesHtml = '';

            foreach ($footnotes as $footnote) {
                if ($footnote['nr'] != 0) {
                    $footnotesHtml .= $this->buildFootnoteItem($footnote, $request);
                }
            }

            $containerFootnotes = str_replace(self::MARKER_FOOTNOTES, $footnotesHtml, $containerFootnotes);
        }

        return $containerFootnotes;
    }

    private function buildFootnoteItem(array $footnote, ServerRequestInterface $request): string
    {
        $viewFactoryData = new ViewFactoryData(
            $this->config['view']['templateRootPaths'],
            $this->config['view']['partialRootPaths'],
            $this->config['view']['layoutRootPaths'],
            null,
            $request
        );
        $view = $this->viewFactory->create($viewFactoryData);
        $view->assign('footnote', $footnote);

        return $view->render('Footnote/Item');
    }
}
