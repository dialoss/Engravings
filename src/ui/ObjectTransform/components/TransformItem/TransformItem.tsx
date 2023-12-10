//@ts-nocheck
import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";
import {ItemsVerbose} from "../../../../modules/ActionForm/helpers/config";


export interface TransformItemStyle {
    secure?: boolean;
    height?: string;
    width?: string;
    top?: string;
    left?: string;
    zIndex?: number;
    movable?: boolean;
    resizable?: boolean;
    aspectRatio?: string;
    padding?: string;
    background?: string;
    border?: string;
    boxShadow?: string;
}

export interface TransformItemProps {
    children: React.ReactNode;
    style: TransformItemStyle,
    className?: string;
    type: string;
    id?: number;
}

function getStyle(style, type) {
    let height = 'auto';
    // if (style.height.match("px")) height =
    return {
        ...style,
        height,
        padding: style.padding ? (style.padding + "px").repeat(4) : '0',
        ...{border: '0', borderRadius: style.border}
    }
}

const TransformItem = ({children, style, type, className, id} : TransformItemProps) => {
    return (
        <TransformButton className={"transform-item transform--move " + className || ''}
                         type={'move'}
                         secure={style.secure}
                         data-type={type}
                         data-top={style.top}
                         data-id={id}
                         style={getStyle(style, type)}>
            {children}
            {
                Object.values(Transforms).map(t => <TransformButton
                        key={t.name}
                        type={t.name}
                        secure={style.secure}
                        className={"transform-resize " + t.name}></TransformButton>)
            }
            {
                ['bottom','top','left','right'].map(s =><div className={"border border-" + s}></div>)
            }
            <div className={"transform-item__info"}>{ItemsVerbose[type].text}</div>
        </TransformButton>
    );
};

export default TransformItem;