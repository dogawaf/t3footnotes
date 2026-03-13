import { Plugin } from '@ckeditor/ckeditor5-core';
import {
  ButtonView,
  createLabeledTextarea,
  Dialog,
  LabeledFieldView,
  submitHandler,
  View
} from '@ckeditor/ckeditor5-ui';
import { toWidget, Widget } from '@ckeditor/ckeditor5-widget';
import '@cag/t3footnotes/translations';

class FootnoteFormView extends View {
  constructor (locale, { isEditMode = false } = {}) {
    super(locale);

    this.set('value', '');

    this._onSubmitCallback = null;
    this._onCancelCallback = null;
    this._onDeleteCallback = null;
    this._isEditMode = isEditMode;

    this.labeledTextareaView = this._createLabeledTextareaView();
    this.saveButtonView = this._createButton(this.t('Save'), true);
    this.cancelButtonView = this._createButton(this.t('Cancel'), false);
    this.deleteButtonView = this._createButton(this.t('Delete footnote'), false);

    const footerChildren = [this.cancelButtonView];

    if (this._isEditMode) {
      footerChildren.push(this.deleteButtonView);
    }
    footerChildren.push(this.saveButtonView);

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-footnote-form'],
        tabindex: '-1',
        style: {
          padding: 'var(--ck-spacing-large)',
          display: 'flex',
          'flex-direction': 'column',
          gap: 'var(--ck-spacing-medium)',
          'min-width': '420px'
        }
      },
      children: [
        this.labeledTextareaView,
        {
          tag: 'div',
          attributes: {
            style: {
              display: 'flex',
              gap: 'var(--ck-spacing-small)',
              'justify-content': 'flex-end'
            }
          },
          children: footerChildren
        }
      ]
    });
  }

  render () {
    super.render();

    submitHandler({
      view: this
    });

    this.labeledTextareaView.fieldView.value = this.value;
    this.labeledTextareaView.fieldView.on('input', () => {
      this.value = this.labeledTextareaView.fieldView.element.value;
    });

    this.saveButtonView.on('execute', () => {
      this.fire('submit');
    });

    this.cancelButtonView.on('execute', () => {
      if (this._onCancelCallback) {
        this._onCancelCallback();
      }
    });

    if (this._isEditMode) {
      this.deleteButtonView.on('execute', () => {
        if (this._onDeleteCallback) {
          this._onDeleteCallback();
        }
      });
    }

    this.on('submit', () => {
      if (!this.validate()) {
        return;
      }

      if (this._onSubmitCallback) {
        this._onSubmitCallback(this.value);
      }
    });
  }

  focus () {
    this.labeledTextareaView.focus();
    this.labeledTextareaView.fieldView.element.select();
  }

  setValue (value) {
    this.value = value || '';
  }

  validate () {
    const value = (this.value || '').trim();
    if (value === '') {
      this.labeledTextareaView.errorText = this.t('Footnote text is required.');
      this.labeledTextareaView.focus();

      return false;
    }

    this.value = value;

    return true;
  }

  onSubmit (callback) {
    this._onSubmitCallback = callback;
  }

  onCancel (callback) {
    this._onCancelCallback = callback;
  }

  onDelete (callback) {
    this._onDeleteCallback = callback;
  }

  _createLabeledTextareaView () {
    const labeledInputView = new LabeledFieldView(this.locale, createLabeledTextarea);
    labeledInputView.label = this.t('Footnote text');
    labeledInputView.placeholder = this.t('Enter footnote text');

    const textareaView = labeledInputView.fieldView;
    textareaView.minRows = 5;
    textareaView.resize = 'vertical';
    textareaView.extendTemplate({
      attributes: {
        class: 'w-100',
      }
    });

    return labeledInputView;
  }

  _createButton (label, isAction) {
    const button = new ButtonView(this.locale);

    button.set({
      label,
      withText: true,
      class: isAction ? 'ck-button-action' : ''
    });

    return button;
  }
}

export class T3Footnotes extends Plugin {
  static get requires () {
    return [Widget, Dialog];
  }

  static get pluginName () {
    return "t3footnotes"
  }

  init () {
    this._defineSchema();
    this._defineConverters();
    this._defineEditingBehaviour();

    const editor = this.editor;

    editor.ui.componentFactory.add('t3footnotes', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: editor.t('Insert Footnote'),
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 13.5h10q.213 0 .356-.144t.144-.357t-.144-.356T17 12.5H7q-.213 0-.356.144t-.144.357t.144.356T7 13.5m0-3h10q.213 0 .356-.144t.144-.357t-.144-.356T17 9.5H7q-.213 0-.356.144t-.144.357t.144.356T7 10.5m0-3h10q.213 0 .356-.144t.144-.357t-.144-.356T17 6.5H7q-.213 0-.356.144t-.144.357t.144.356T7 7.5M4.616 17q-.691 0-1.153-.462T3 15.385V4.615q0-.69.463-1.153T4.615 3h14.77q.69 0 1.152.462T21 4.615v13.518q0 .534-.497.742t-.876-.171L17.923 17z"/></svg>',
        tooltip: true
      });

      view.on('execute', () => {
        this._openFootnoteDialog();
      });

      return view;
    });
  }

  _openFootnoteDialog (existingElement = null) {
    const editor = this.editor;
    const dialog = editor.plugins.get('Dialog');
    const formView = new FootnoteFormView(editor.locale, {
      isEditMode: Boolean(existingElement)
    });

    const existingContent = existingElement ? (existingElement.getAttribute('content') || '') : '';

    formView.setValue(existingContent);

    formView.onSubmit(content => {
      editor.model.change(writer => {
        if (existingElement) {
          writer.setAttribute('content', content, existingElement);
        } else {
          const footnoteElement = writer.createElement('t3footnote', {
            content
          });

          editor.model.insertContent(footnoteElement);
        }
      });

      dialog.hide();
    });

    formView.onCancel(() => {
      dialog.hide();
    });

    if (existingElement) {
      formView.onDelete(() => {
        editor.model.change(writer => {
          writer.remove(existingElement);
        });

        dialog.hide();
      });
    }

    dialog.show({
      isModal: true,
      title: existingElement ? editor.t('Edit Footnote') : editor.t('Insert Footnote'),
      content: formView,
      actionButtons: [],
      onShow: () => {
        formView.focus();
      }
    });
  }

  _defineSchema () {
    const schema = this.editor.model.schema;

    schema.register('t3footnote', {
      isInline: true,
      isObject: true,
      allowWhere: '$text',
      allowAttributes: ['content']
    });
  }

  _defineConverters () {
    const conversion = this.editor.conversion;

    conversion.for('upcast').elementToElement({
      view: {
        name: 'sup',
        classes: 't3foonote'
      },
      model: (viewElement, { writer }) => {
        let content = '';

        for (const child of viewElement.getChildren()) {
          if (
            child.is &&
            child.is('element', 'span') &&
            child.hasClass('t3foonotes-anchor-data')
          ) {
            const firstChild = child.getChild(0);
            content = firstChild && firstChild.data ? firstChild.data : '';
            break;
          }
        }

        return writer.createElement('t3footnote', { content });
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 't3footnote',
      view: (modelElement, { writer }) => {
        const content = modelElement.getAttribute('content') || '';

        const sup = writer.createContainerElement('sup', { class: 't3foonote' });
        const anchor = writer.createContainerElement('a', {
          id: 'fn-anchor-{n}',
          class: 't3foonotes-anchor',
          href: '#fn-content-{n}',
          title: '',
        });
        const text = writer.createText('[{n}]');
        const dataSpan = writer.createContainerElement('span', {
          class: 't3foonotes-anchor-data',
          style: 'display: none'
        });
        const dataText = writer.createText(content);

        writer.insert(writer.createPositionAt(anchor, 0), text);
        writer.insert(writer.createPositionAt(sup, 0), anchor);
        writer.insert(writer.createPositionAt(sup, 1), dataSpan);
        writer.insert(writer.createPositionAt(dataSpan, 0), dataText);

        return sup;
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 't3footnote',
      view: (modelElement, { writer }) => {
        const content = modelElement.getAttribute('content') || '';

        const sup = writer.createContainerElement('sup', {
          class: 't3foonote',
          'data-footnote-content': content
        });

        const anchor = writer.createRawElement(
          'a',
          {
            class: 't3foonotes-anchor',
            title: content
          },
          domElement => {
            domElement.innerText = '[fn]';
          }
        );

        writer.insert(writer.createPositionAt(sup, 0), anchor);

        return toWidget(sup, writer, { label: 'footnote widget' });
      }
    });
  }

  _defineEditingBehaviour () {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;

    this.listenTo(viewDocument, 'click', (evt, data) => {
      const viewElement = data.target;
      if (!viewElement || !viewElement.is || !viewElement.is('element')) {
        return;
      }

      const footnoteView = viewElement.findAncestor('sup');
      if (!footnoteView || !footnoteView.hasClass('t3foonote')) {
        return;
      }

      const modelElement = editor.editing.mapper.toModelElement(footnoteView);
      if (!modelElement || modelElement.name !== 't3footnote') {
        return;
      }

      data.preventDefault();
      evt.stop();

      this._openFootnoteDialog(modelElement);
    });
  }
}
