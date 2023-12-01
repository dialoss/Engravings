
import formData from './data.json';
import allFields from './all.json';
import {FieldsOrder, ItemsVerbose} from "./config";

export function serializeFields(fields, method) {
    let newFields = {};
    for (const f in fields) {
        newFields[f] = fields[f].value;
    }
    if (newFields.url) {
        if (method === 'POST') {
            newFields.items = structuredClone(newFields.url);
            delete newFields.url;
        } else {
            for (const field of ['width', 'height', 'filename', 'type']) {
                newFields[field] = newFields.url[0][field];
            }
            newFields.url = newFields.url[0].url;
        }
    }
    if (newFields.page_from !== undefined) {
        if (!newFields.page_from) delete newFields.page_from;
        else newFields.page_from = {path:newFields.page_from};
    }
    // console.log(newFields)
    return newFields;
}

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
    if (field === 'page_from' && element.data[field]) return element.data[field].path;
    return element.data[field];
}

function serializeValue(value, type) {
    if (type === 'checkbox') return !!value;
    return value;
}

export function mapFields(fields) {
    return fields.map(f => allFields[f]);
}

export function getFormData({method, element, extraFields=[], initialData={}}) {
    let elType = element.data.type;
    let fieldsRaw = [...mapFields(formData[elType]), ...mapFields(extraFields)];
    let orderedFields = [];
    let otherFields = [];
    for (const f of FieldsOrder) {
        fieldsRaw.forEach(field => {
            if (field.name === f) orderedFields.push(field);
            else otherFields.push(field);
        })
    }
    let fields = [...orderedFields,...otherFields];

    let form = {
        method,
        title: (method === 'PATCH' ? 'Редактировать ' : 'Добавить ') + (ItemsVerbose[elType].text || ''),
        button: 'ok',
        data: {type: {value: elType}},
    };
    if (method === 'POST') form.specifyParent = true;
    else form.specifyElement = true;
    const getValue = (field) => serializeValue((method !== 'POST' ? getFieldData(field.name, element) :
        (initialData[field.name] !== undefined ? initialData[field.name] :
            (field.initial === null ? '' : field.initial))), field.type);

    fields.forEach((field) => {
        form.data[field.name] = {value: getValue(field), ...field};
    });
    console.log(fieldsRaw)
    return form;
}