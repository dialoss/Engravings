//@ts-nocheck
export function clearTextFromHTML(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
}