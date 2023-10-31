import React from 'react';

export function TooltipFields(data) {
    let tooltipFields = [];
    if (data.filetype === 'model') tooltipFields.push({
        title: 'ID Модели',
        text: data.urn.slice(0, 12) + '...' + data.urn.slice(-12, -1),
    });

    const fieldTranslate = {
        size: 'Размер',
        modifiedTime: 'Время изменения',
    }

    tooltipFields.push({
        title: fieldTranslate.size,
        text: window.filemanager.GetDisplayFilesize(data.size),
    })

    for (const field of ['modifiedTime']) {
        tooltipFields.push({
            title: fieldTranslate[field],
            text: data[field],
        })
    }
    return tooltipFields;
}

const Tooltip = ({data}) => {
    return (
        <>
            {
                TooltipFields(data).map(t => <div className={'tooltip-item'} key={t.title}>
                    <p>{t.title}:</p>
                    <p>{t.text}</p>
                </div>)
            }
        </>
    );
};
export default Tooltip;