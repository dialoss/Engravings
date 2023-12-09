
import formData from './data.json';
import allFields from './all.json';
import {FieldsOrder, ItemsVerbose} from "./config";
import FormUpload from "../../../components/Modals/MyForm/Upload/FormUpload";
import FormInput from "../../../components/Modals/MyForm/Input/FormInput";
import FormTextarea from "../../../components/Modals/MyForm/Textarea/FormTextarea";
import FormSelect from "../../../components/Modals/MyForm/Select/FormSelect";
import FormCheckbox from "../../../components/Modals/MyForm/Checkbox/FormCheckbox";

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
                newFields[field] = newFields.url[0][field] || newFields[field];
            }
            newFields.url = newFields.url[0].url;
        }
    }
    if (newFields.page_from !== undefined) {
        if (!newFields.page_from) delete newFields.page_from;
        else newFields.page_from = {path:newFields.page_from};
    }
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

interface IFormField {
    name: string;
    type: "input" | "textarea" | "checkbox" | "color" | "slider" | "upload";
    validate?: string;
    attrs?: ['required'];
    label: string;
    autocomplete?: string;
    value: string;
}

export interface IFormData {
    [key: string] : IFormField;
}

interface IForm {
    button: string;
    method: "POST" | "PATCH";
    title: string;
    data: IFormData;
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
    let fields: IFormField[] = [...orderedFields,...otherFields];

    let form: IForm = {
        method,
        title: (method === 'PATCH' ? 'Редактировать ' : 'Добавить ') + (ItemsVerbose[elType].text || ''),
        button: 'ok',
        data: {},
    };
    const getValue = (field) => serializeValue((method !== 'POST' ? getFieldData(field.name, element) :
        (initialData[field.name] !== undefined ? initialData[field.name] :
            (field.initial === null ? '' : field.initial))), field.type);

    fields.forEach((field) => {
        form.data[field.name] = {value: getValue(field), ...field};
    });
    console.log(fieldsRaw)
    return form;
}