import React from 'react';

const Dot = ({...props}) => {
    return (
        <div className={"timeline-dot"}>
            <div {...props}></div>
        </div>
    );
};

export default Dot;