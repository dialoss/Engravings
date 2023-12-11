//@ts-nocheck
import React, {useEffect, useRef} from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";
import {ItemsVerbose} from "../../../../modules/ActionForm/helpers/config";
import {useAppSelector} from "../../../../hooks/redux";


export interface TransformItemStyle {
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
    let height = style.height;
    // if (style.height.match("px")) height =
    return {
        ...style,
        height: 'auto',
        minHeight: height,
        background: style.background || "#fff",
        padding: style.padding ? (style.padding + "px").repeat(4) : '0',
        ...{border: '0', borderRadius: style.border}
    }
}

const Resizers = () => {
    return (
        <div className={"resizers"}>
            {
                Object.values(Transforms).map(t => <TransformButton
                    key={t.name}
                    type={t.name}
                    className={"transform-resize " + t.name}></TransformButton>)
            }
        </div>
    );
}

const Borders = ({type}) => {
    return (
        <div className={"borders " + type}>
        </div>
    );
}

const Info = ({type, style}) => {
    return (
        <div className="info">
            {ItemsVerbose[type].text}
        </div>
    )
}

const TransformItem = ({children, style, type, className, id} : TransformItemProps) => {
    const focused = useAppSelector(state => state.elements.focused);
    const edit = useAppSelector(state => state.elements.editPage);
    useEffect(() => {
        if (!style.top) return;
        let it = document.querySelector(`.transform-item[data-id="${id}"]`);
        if (!it) return;
        if (!edit) {
            let t = style.top.replace("px", '');
            const cont = it.parentElement.closest('.transform-item');
            if (t) it.style.top = t / cont.getBoundingClientRect().height * 100 + "%";
        } else {
            it.style.top = style.top;
        }
    }, [edit]);
    return (
        <TransformButton className={`transform-item transform--move ${edit ? "edit" : ''} ` + className || ''}
                         type={'move'}
                         data-type={type}
                         data-top={style.top}
                         data-id={id}
                         data-width={style.width}
                         data-height={style.height}
                         style={getStyle(style, type)}>
            {children}
            {focused.id === id && <div className={"item__edit " + (focused.id === id ? 'focused' : '')}>
                <Borders type={type}></Borders>
                <Resizers></Resizers>
                <Info type={type} style={style}></Info>
            </div>}
        </TransformButton>
    );
};

export default TransformItem;