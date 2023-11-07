import React, {useContext} from 'react';
import InfoParagraph from "ui/InfoParagraph/InfoParagraph";
import './InfoBlock.scss';
import ActionButton from "ui/Buttons/ActionButton/ActionButton.jsx";
import dayjs from "dayjs";
import {triggerEvent} from "helpers/events";
import {ActiveThemes} from "../Themes";

const InfoBlock = ({data, className, extra}) => {
    const theme = useContext(ActiveThemes);
    const style = theme.listStyle || {};
    const formattedDate = dayjs(data.date_created).format("HH:mm DD.MM.YYYY");
    for (const item of (data.items || [])) {
        if (!!item.price) data = {...data, price: item.price};
    }
    return (
        <div className={style.info__block || "info__block " + (className || '')}>
            {!!data.title && <InfoParagraph type={'title'}
                                            style={!!data.description?{}:{paddingBottom:"8px"}}>
                                                {data.title}</InfoParagraph>}
            <span className="info__block-section">
                {!!data.date_created && data.show_date && <InfoParagraph type={'date'}>{formattedDate}</InfoParagraph>}
                {!!data.description && <InfoParagraph type={'description'}>{data.description}</InfoParagraph>}
            </span>
            {!!data.filename && <InfoParagraph style={{display:"none"}} type={'filename'}>{data.filename}</InfoParagraph>}
            {extra}
        </div>
    );
};

export default InfoBlock;