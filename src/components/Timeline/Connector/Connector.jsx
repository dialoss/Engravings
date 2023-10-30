import React from 'react';

const Connector = ({...props}) => {
    return (
        <div className={"timeline-connector"}>
            <div {...props}></div>
        </div>
    );
};

export default Connector;