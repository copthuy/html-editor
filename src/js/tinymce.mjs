export default function initTinymce() {
    tinymce.init({
        selector: '#wysiwyg',
        license_key: 'gpl',
        browser_spellcheck: false,
        promotion: false,
        //skin: 'oxide-dark',
        //content_css: 'dark',
        resize: false,
        branding: false,
        width: '100%',
        height: '100%',
        plugins: ['link', 'lists', 'table'],
        toolbar: [
            { name: 'history', items: ['undo', 'redo'] },
            { name: 'styles', items: ['styles'] },
            { name: 'formatting', items: ['bold', 'italic', 'underline'] },
            { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
            { name: 'link', items: ['link'] },
            { name: 'color', items: ['forecolor', 'backcolor'] },
            { name: 'lists', items: ['bullist', 'numlist'] },
            { name: 'indentation', items: ['outdent', 'indent'] },
            { name: 'table', items: ['table'] }
        ],
        setup: tinymceSetup
    });
}

function tinymceSetup(editor) {
    function triggerEvent() {
        const updateEvent = new CustomEvent("wysiwygChanged", {
            detail: {
                timestamp: Date.now(),
                data: editor.getContent({ format: 'html' }),
            },
        });
        document.dispatchEvent(updateEvent);
    }

    document.querySelector('[name="spell"]').addEventListener('change', evt => {
        const body = editor.getBody();
        body.setAttribute('spellcheck', evt.currentTarget.checked);
    });

    document.addEventListener('codeMirrorChanged', async evt => {
        if (editor.hasFocus()) {
            return;
        }
        editor.setContent(evt.detail.data);
    });
    editor.on('change', triggerEvent);
    editor.on('input', triggerEvent);
}