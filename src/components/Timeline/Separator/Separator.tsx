import React from 'react';

const Separator = ({children}) => {
    return (
        <div className={"timeline-separator"}>
            {children}
        </div>
    );
};

export default Separator;