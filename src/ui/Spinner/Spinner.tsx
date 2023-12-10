//@ts-nocheck
import React from 'react';
import "./Spinner.scss";

const Spinner = ({type='fixed'}) => {
    return (
        <div className={"spinner-wrapper " + type}>
            <div className={'spinner'}></div>
        </div>
    );
};

export default Spinner;