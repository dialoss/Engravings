import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";


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
}

export interface TransformItemProps {
    children: React.ReactNode;
    style: TransformItemStyle,
    className: string;
    type: string;
    id: number;
}

function getStyle(style, type) {
    return {
        ...style,
        height: (type === 'modal' || style.height.match('px')) ? style.height : 'auto',
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

        </TransformButton>
    );
};

export default TransformItem;