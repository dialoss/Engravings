import React from 'react';
import {Transforms} from "../../config";
import TransformButton from "./TransformButton";

const resizers = {
    width:"100%",
    height:"1px",
    position:"relative"
}

const TransformItem = ({children, config}) => {
    function formatProperty(name, property, sign) {
        if (property !== "0")
            return property + sign;
        return "auto";
    }
    const initialTransform = {
        width: formatProperty('width',config.max_width, "%"),
        left: formatProperty('left',config.left, "%"),
        top: formatProperty('top', config.top,"px"),
        position: config.position,
        ...(config.zIndex ? {zIndex: config.zIndex}: {}),
    };
    return (
        <TransformButton className={"transform-item transform--move"} type={'move'} style={initialTransform}>
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