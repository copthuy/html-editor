import { format } from 'prettier/standalone';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginMarkdown from 'prettier/plugins/markdown';
import DOMPurify from 'dompurify';
import he from 'he';

export async function formatCode(html) {
    const option = document.querySelector('[name="lang"]:checked')?.value;
    const formatted = await format(clean(html), {
        parser: option,
        plugins: [option === 'markdown' ? prettierPluginMarkdown : prettierPluginHtml],
        tabWidth: 4,
        useTabs: false
    });

    return formatted;
}

function clean(html) {
    html = DOMPurify.sanitize(html, {
        FORBID_ATTR: ['id']
    });
    html = entity(html);
    html = html.replace(/&amp;(?=[\S])/g, '&');

    return html;
}

function entity(html) {
    const encode = document.querySelector('[name="entity"]')?.checked || false;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
        let parent = node.parentElement;
        let skip = false;
        while (parent && parent !== doc.body) {
            const tag = parent.tagName.toLowerCase();
            if (tag === 'pre' || tag === 'code') {
                skip = true;
                break;
            }
            parent = parent.parentElement;
        }

        let content = node.nodeValue;
        if (!skip) {
            content = content.replace(/\s+/g, ' ');
        }

        const transformed = encode
            ? he.encode(content, {
                useNamedReferences: true,
                encodeEverything: false,
                allowUnsafeSymbols: false
            })
            : he.decode(content);

        node.nodeValue = transformed;
    }

    let response = doc.body.innerHTML;
    if (!encode) {
        response = response.replace(/&amp;/g, '&');
    }

    return response;
}
