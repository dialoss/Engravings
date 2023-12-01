import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";

const TransformItem = ({children, config, className, ...props}) => {
    // console.log(config)
    return (
        <TransformButton className={"transform-item transform--move " + className || ''}
                         type={'move'}
                         {...props}
                         secure={config.secure}
                         data-top={config.top}
                         style={{...config, height: props['data-type'] === 'modal' ? config.height : 'auto',}}>
            {children}
            <div className={"transform-resizers"}>
                {
                    Transforms.map(t => <TransformButton
                        key={t.name}
                        type={t.name}
                        secure={config.secure}
                        className={"transform-origin transform-resize " + t.name}></TransformButton>)
                }
            </div>
        </TransformButton>
    );
};

export default TransformItem;