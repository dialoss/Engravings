export function getSettings(name, data) {
    switch (name) {
        case 'show_date': case 'show_shadow':
            return {
                [name]: !data[name],
            };
        case 'clear_position':
            return {
                'position': 'initial',
                'top': '0',
                'left': '0',
            };
        case 'clear_size':
            return {
                'width': 'auto',
            };
    }
}

export function getSettingText(text, positive) {
    if (positive) {
        text = "Не " + text.toLowerCase();
    }
    return text;
}