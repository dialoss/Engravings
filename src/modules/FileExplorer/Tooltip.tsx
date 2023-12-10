//@ts-nocheck
import React from 'react';
import {StorageFile} from "./api/google";

interface TooltipField {
    title: string,
    text: string,
}

export function TooltipFields(file: StorageFile) {
    let tooltipFields: TooltipField[] = [];
    if (file.type === 'model') tooltipFields.push({
        title: 'ID Модели',
        text: file.props.urn.slice(0, 12) + '...' + file.props.urn.slice(-12, -1),
    });

    const fieldTranslate = {
        size: 'Размер',
        modifiedTime: 'Время изменения',
        width: 'Ширина',
        height: 'Высота',
    }

    tooltipFields.push({
        title: fieldTranslate.size,
        text: window.filemanager.GetDisplayFilesize(file.size),
    })

    for (const field of ['modifiedTime']) {
        tooltipFields.push({
            title: fieldTranslate[field],
            text: file[field],
        })
    }
    if (file.type.match(/video|image/)) {
        for (const field of ['width', 'height']) {
            tooltipFields.push({
                title: fieldTranslate[field],
                text: file[field],
            })
        }
    }
    return tooltipFields;
}

const Tooltip = ({file}) => {
    return (
        <>
            {
                TooltipFields(file).map(t => <div className={'tooltip-item'} key={t.title}>
                    <p>{t.title}:</p>
                    <p>{t.text}</p>
                </div>)
            }
        </>
    );
};
export default Tooltip;