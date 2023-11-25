import React from 'react';

const Connector = ({style, name}) => {
    return (
        <div className={"timeline-connector " + name} style={{margin:style.margin}}>
            <div style={{backgroundColor: style.backgroundColor, borderRadius: style.border}}></div>
        </div>
    );
};

export default Connector;