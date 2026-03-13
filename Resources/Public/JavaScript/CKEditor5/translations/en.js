((CKEDITOR_TRANSLATIONS, lang, dict) => {
  CKEDITOR_TRANSLATIONS[lang] = CKEDITOR_TRANSLATIONS[lang] || {};
  CKEDITOR_TRANSLATIONS[lang].dictionary = CKEDITOR_TRANSLATIONS[lang].dictionary || {};
  Object.assign(CKEDITOR_TRANSLATIONS[lang].dictionary, dict);
})(
  window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}),
  'en',
  {
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Delete footnote': 'Delete footnote',
    'Footnote text is required.': 'Footnote text is required.',
    'Footnote text': 'Footnote text',
    'Enter footnote text': 'Enter footnote text',
    'Edit Footnote': 'Edit Footnote',
    'Insert Footnote': 'Insert Footnote',
  }
);
