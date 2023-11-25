import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";

const resizers = {
    width:"100%",
    height:"1px",
    position:"relative"
}

const TransformItem = ({children, config, className, secure, ...props}) => {
    const initialTransform = {
        movable: config.movable !== undefined ? config.movable : true,
        resizable: config.resizable !== undefined ? config.resizable : true,
        ...config,
        height: props['data-type'] === 'modal' ? config.height : 'auto',
        ...(config.zindex ? {zIndex: config.zindex}: {}),
    };
    return (
        <TransformButton className={"transform-item transform--move " + className || ''}
                         type={'move'}
                         {...props}
                         secure={secure}
                         data-top={config.top}
                         style={initialTransform}>
            {children}
            <div className={"transform-resizers"} style={resizers}>
                {Object.keys(Transforms.child).map(name => {
                    const tr = Transforms.child[name];
                    return tr.buttons.map(btn => {
                        return React.createElement(TransformButton, {
                            className: "transform-resize " + btn.style,
                            key: btn.name,
                            type: btn.name,
                            style: {resizable: config.resizable},
                        });
                    })
                })}
            </div>
        </TransformButton>
    );
};

export default TransformItem;