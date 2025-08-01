export async function formatCode(html) {
    const option = document.querySelector('[name="lang"]:checked')?.value;
    const formatted = await prettier.format(clean(html), {
        parser: option,
        plugins: [option === 'markdown' ? prettierPlugins.markdown : prettierPlugins.html],
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
        const original = node.nodeValue;

        const transformed = encode
            ? he.encode(original, {
                useNamedReferences: true,
                encodeEverything: false,
                allowUnsafeSymbols: false
            })
            : he.decode(original);

        const newNode = doc.createTextNode(transformed);
        node.parentNode.replaceChild(newNode, node);
    }

    let response = doc.body.innerHTML;
    if (!encode) {
        response = response.replace(/&amp;/g, '&');
    }

    return response;
}