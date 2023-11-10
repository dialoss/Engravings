import React, {useLayoutEffect} from 'react';
import InfoParagraph from "ui/InfoParagraph/InfoParagraph";
import './InfoBlock.scss';
import dayjs from "dayjs";

const InfoBlock = ({data, className, extra}) => {
    const formattedDate = dayjs(data.date_created).format("HH:mm DD.MM.YYYY");
    for (const item of (data.items || [])) {
        if (!!item.price) data = {...data, price: item.price};
    }
    const date = !!data.date_created && data.show_date && formattedDate + ' ';
    let description = structuredClone(data.description);
    if (date) description = `<strong>${date}</strong>` + ' ' + description;

    return (
        <div className={"info__block " + (className || '')}>
            {!!data.title && <InfoParagraph type={'title'}
                                            style={!!data.description?{}:{paddingBottom:"8px"}}>
                                                {data.title}</InfoParagraph>}
            <span className="info__block-section">
                {!!data.description && <InfoParagraph type={'description'}>{description}</InfoParagraph>}
            </span>
            {!!data.filename && <InfoParagraph type={'filename'} style={{display:'none'}}>{data.filename}</InfoParagraph>}
            {extra}
        </div>
    );
};

export default InfoBlock;