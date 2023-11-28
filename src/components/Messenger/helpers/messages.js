export function getMessageText(message) {
    let msgText = '';
    if (message.value) {
        msgText = message.value.text;
        if (!msgText && !!message.value.upload.length) msgText = message.value.upload[0].filename;
    }
    return msgText;
}