export function processMarkDown(htmlString) {
    const clean = DOMPurify.sanitize(htmlString);
    const gfm = turndownPluginGfm.gfm
    const converter = new TurndownService();
    converter.use(gfm);

    return converter.turndown(clean);
}

export function processHTML(markdownString) {
    const converter = new showdown.Converter({tables: true});
    return converter.makeHtml(markdownString);
}