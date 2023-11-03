import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";
import "./TransformItem.scss";

const resizers = {
    width:"100%",
    height:"1px",
    position:"relative"
}

const TransformItem = ({children, config, className}) => {
    function formatProperty(name, property, sign) {
        if (property !== "0")
            return property + sign;
        return "auto";
    }
    const initialTransform = {
        movable: config.movable !== undefined ? config.movable : true,
        // height: formatProperty('height',config.height, "px"),
        width: formatProperty('width',config.width, "%"),
        left: formatProperty('left',config.left, "%"),
        position: config.position,
        ...(config.zIndex ? {zIndex: config.zIndex}: {}),
    };
    return (
        <TransformButton className={"transform-item transform--move " + className || ''}
                         type={'move'}
                         data-top={config.top}
                         // data-height={config.height}
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
                        });
                    })
                })}
            </div>
        </TransformButton>
    );
};

export default TransformItem;