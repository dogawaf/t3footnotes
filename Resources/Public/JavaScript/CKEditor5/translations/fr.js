((CKEDITOR_TRANSLATIONS, lang, dict) => {
  CKEDITOR_TRANSLATIONS[lang] = CKEDITOR_TRANSLATIONS[lang] || {};
  CKEDITOR_TRANSLATIONS[lang].dictionary = CKEDITOR_TRANSLATIONS[lang].dictionary || {};
  Object.assign(CKEDITOR_TRANSLATIONS[lang].dictionary, dict);
})(
  window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}),
  'fr',
  {
    'Save': 'Enregistrer',
    'Cancel': 'Annuler',
    'Delete footnote': 'Supprimer la note',
    'Footnote text is required.': 'Le texte de la note de bas de page est obligatoire.',
    'Footnote text': 'Texte de la note de bas de page',
    'Enter footnote text': 'Saisir le texte de la note de bas de page',
    'Edit Footnote': 'Editer la note de bas de page',
    'Insert Footnote': 'Insérer une note de bas de page',
  }
);
