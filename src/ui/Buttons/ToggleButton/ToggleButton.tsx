import React from 'react';
import "./ToggleButton.scss";

const ToggleButton = ({isOpened, children, width=24, ...props}) => {
    return (
        <div style={{width, height: width}} {...props} className={"toggle-button " + (isOpened ? "opened" : "closed")}>
            {children}
        </div>
    );
};

export default ToggleButton;