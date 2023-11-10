
import formData from './FormData.json';

function getFieldData(field, element) {
    if (!element.id) return '';
    if (field === 'url') {
        if (!['video', 'image', 'model', 'file'].includes(element.data.type)) return [];
        return [{
            type: element.data.type,
            id: element.data.id,
            url: element.data.url,
            filename: element.data.filename,
        }];
    }
    return element.data[field];
}

export function getFormData({method, element}) {
    let fields = Object.values(formData[element.data.type]);
    let form = {
        method,
        button: 'ok',
        data: {},
        windowButton: true,
    };
    if (method === 'POST') form.specifyParent = true;
    else form.specifyElement = true;
    fields.forEach((field) => {
        if (field.label.length > 1) {
            for (const l of field.label) {
                let name = Object.keys(l)[0];
                let value = method !== 'POST' ? (element.data[field.name] && element.data[field.name][name]) : '';
                form.data[name] = {value:value, ...field, attrs:[field.required && 'required'], name, label:Object.values(l)[0]};
            }
        } else {
            let value = method !== 'POST' ? getFieldData(field.name, element) : '';
            form.data[field.name] = {value, ...field, attrs:[field.required && 'required']};
        }
    });
    return form;
}