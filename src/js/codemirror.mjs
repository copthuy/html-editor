import { basicSetup } from "https://esm.sh/codemirror";
import { EditorView, keymap } from "https://esm.sh/@codemirror/view";
import { indentWithTab } from "https://esm.sh/@codemirror/commands";
import { EditorState, StateEffect } from "https://esm.sh/@codemirror/state";
import { html } from "https://esm.sh/@codemirror/lang-html";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark";
import { formatCode } from './html.mjs';
import { processMarkDown, processHTML } from './markdown.mjs';

export default function initCodeMirror() {
    const baseExtensions = [
        basicSetup,
        oneDark,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of(syncFromCodeMirror)
    ];

    const editor = new EditorView({
        state: EditorState.create({
            doc: "", // Empty at start
            extensions: [
                ...baseExtensions,
                html(),
            ]
        }),
        parent: document.getElementById('editor')
    });

    function syncFromCodeMirror(update) {
        if (!update.docChanged) return;
        const option = document.querySelector('[name="lang"]:checked');

        let data = update.state.doc.toString();
        if (option.value === 'markdown') {
            data = processHTML(data);
        }
        const updateEvent = new CustomEvent("codeMirrorChanged", {
            detail: {
                timestamp: Date.now(),
                data: data,
            },
        });
        document.dispatchEvent(updateEvent);
    }

    document.querySelectorAll('[name="lang"]').forEach(input => {
        input.addEventListener('change', async () => {
            const option = document.querySelector('[name="lang"]:checked');
            let effects = StateEffect.reconfigure.of([
                ...baseExtensions,
                html()
            ]);
            if (option.value === 'markdown') {
                effects = StateEffect.reconfigure.of([
                    ...baseExtensions,
                    markdown()
                ]);
            }
            editor.dispatch({
                effects: effects,
            });

            const wysiwyg = tinymce?.get(0)?.getContent({ format: 'html' }) ?? '';
            if (wysiwyg) {
                await editorUpdate(editor, wysiwyg);
            }
        });
    });

    document.querySelector('[name="entity"]').addEventListener('change', () => {
        const doc = editor.state.doc.toString();
        editorUpdate(editor, doc, false);
    });

    document.addEventListener('wysiwygChanged', async evt => {
        if (editor.hasFocus) {
            return;
        }
        let doc = evt.detail.data;
        await editorUpdate(editor, doc);
    });
}

async function editorUpdate(editor, doc, process = true) {
    const option = document.querySelector('[name="lang"]:checked');
    
    if (process === true && option.value === 'markdown') {
        doc = processMarkDown(doc);
    }
    doc = await formatCode(doc);

    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: doc
        }
    });
}