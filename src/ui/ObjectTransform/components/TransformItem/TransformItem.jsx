import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";

const TransformItem = ({children, config, className, ...props}) => {
    return (
        <TransformButton className={"transform-item transform--move " + className || ''}
                         type={'move'}
                         {...props}
                         secure={config.secure}
                         data-top={config.top}
                         style={{...config, height: (props['data-type'] === 'modal' || config.height.match('px')) ? config.height : 'auto',}}>
            {children}
            {
                Object.values(Transforms).map(t => <TransformButton
                        key={t.name}
                        type={t.name}
                        secure={config.secure}
                        className={"transform-resize " + t.name}></TransformButton>)
            }

        </TransformButton>
    );
};

export default TransformItem;