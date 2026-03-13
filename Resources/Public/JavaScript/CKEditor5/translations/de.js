((CKEDITOR_TRANSLATIONS, lang, dict) => {
  CKEDITOR_TRANSLATIONS[lang] = CKEDITOR_TRANSLATIONS[lang] || {};
  CKEDITOR_TRANSLATIONS[lang].dictionary = CKEDITOR_TRANSLATIONS[lang].dictionary || {};
  Object.assign(CKEDITOR_TRANSLATIONS[lang].dictionary, dict);
})(
  window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}),
  'de',
  {
    'Save': 'Speichern',
    'Cancel': 'Stornieren',
    'Delete footnote': 'Fußnote löschen',
    'Footnote text is required.': 'Fußnotentext ist erforderlich.',
    'Footnote text': 'Fußnotentext',
    'Enter footnote text': 'Geben Sie den Fußnotentext ein',
    'Edit Footnote': 'Fußnote bearbeiten',
    'Insert Footnote': 'Fußnote einfügen',
  }
);
