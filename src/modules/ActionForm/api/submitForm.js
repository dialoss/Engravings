import {getLocation} from "hooks/getLocation";
import {triggerEvent} from "helpers/events";

export function submitForm(form, callback=null) {
    let sendForm = {};
    Object.keys(form.data).forEach((field) => sendForm[field] = form.data[field].value);
    sendForm.items = [...(sendForm.media || []), ...(sendForm.files || [])];
    sendForm.items = sendForm.items.filter(item => (!item.id || item.id === -1));
    sendForm.method = form.method;
    sendForm.element = form.element;
    sendForm.display_pos = sendForm.element.display_pos;

    if (sendForm.element.type === 'screen') sendForm.element = {type: 'item'};
    if (sendForm.new_page_slug) {
        sendForm.page_from = {
            slug: sendForm.new_page_slug,
            path: getLocation().relativeURL.slice(1) + sendForm.new_page_slug,
        }
    }

    for (const field of ['media', 'files', 'textfields']) {
        delete sendForm[field];
    }
    if (form.type !== 'buy') {
        if (callback) callback([sendForm]);
        else triggerEvent("action:callback", [sendForm]);
    }
}