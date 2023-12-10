//@ts-nocheck
import React from 'react';

const Connector = ({style, name}) => {
    return (
        <div className={"timeline-connector " + name} style={{margin:style.margin, height: style.height}}>
            <div style={{backgroundColor: style.backgroundColor, borderRadius: style.border}}></div>
        </div>
    );
};

export default Connector;