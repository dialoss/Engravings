import React from 'react';
import "./Container.scss";

const Container = ({children, ...props}) => {
    return (
        <div className={"container"} {...props}>
            {children}
        </div>
    );
};

export default Container;