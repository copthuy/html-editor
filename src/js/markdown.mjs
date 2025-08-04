export function processMarkDown(htmlString) {
    const clean = DOMPurify.sanitize(htmlString);
    const converter = new TurndownService();

    return converter.turndown(clean);
}

export function processHTML(markdownString) {
    const converter = new showdown.Converter({tables: true});
    return converter.makeHtml(markdownString);
}