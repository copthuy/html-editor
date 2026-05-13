import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import showdown from 'showdown';

export function processMarkDown(htmlString) {
    const clean = DOMPurify.sanitize(htmlString);
    const converter = new TurndownService();
    converter.use(gfm);

    return converter.turndown(clean);
}

export function processHTML(markdownString) {
    const converter = new showdown.Converter({tables: true});
    return converter.makeHtml(markdownString);
}