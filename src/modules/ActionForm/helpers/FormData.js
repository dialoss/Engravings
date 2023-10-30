import formData from './FormData.json';
import store from 'store';

function initData() {
    let propsRefactor = {};
    Object.values(formData.properties).forEach(field => {
        propsRefactor[field.name] = field;
    });
    formData.properties = propsRefactor;
}

initData();

function setFormField(form, field, value) {
    if (Object.keys(form).includes(field)) form[field].value = value;
}

function fillUploads(form, uploads) {
    if (!uploads) return;
    const media = uploads.filter(upload => ['image', 'video'].includes(upload.type));
    const files = uploads.filter(upload => ['file', 'table'].includes(upload.type));
    setFormField(form.data, 'media', media.map(f => {
        return {
            id: f.id,
            type: f.type,
            url: f.url,
            filename: f.filename,
        }
    }));
    setFormField(form.data, 'files', files.map(f => {
        return {
            id: f.id,
            type: f.type,
            url: f.url,
            filename: f.filename,
        }
    }));
}

function fillText(form, element) {
    if (element.id === -1) return;
    for (const field of ['description', 'title', 'price']) {
        setFormField(form.data, field, element.data[field]);
    }
}

export function getFormData(type, element) {
    const location = store.getState().location;
    let properties = formData.properties;
    let formType = formData.fields[type];
    let formFields = {};
    if (type === 'edit' && element.type !== 'item') {
        formFields = formType[element.data.type];
    }
    else {
        let fieldsPage = {};
        if (location.parentSlug === location.pageSlug) {
            fieldsPage = formType['parent'];
        } else {
            fieldsPage = formType['child'];
        }
        formFields = fieldsPage[location.parentSlug];
        if (formFields === undefined) {
            formFields = fieldsPage['base'];
        }
    }

    let form = {
        type: type,
        element: {type: element.type, id: element.id, data: element.data},
        title: formType.title,
        button: formType.button.split('_')[1],
        method: '',
        data: {},
        windowButton: true,
    };
    formFields.forEach((field) => {
        form.data[properties[field].name] = structuredClone(properties[field]);
    });
    if (type === 'buy') return form;
    if (type === 'edit') {
        fillText(form, element);
        fillUploads(form, element.data.items || [element.data]);
        form.method = 'PATCH';
    } else if (type === 'add') {
        form.method = 'POST';
    }
    return form;
}