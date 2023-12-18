//@ts-nocheck
import React from 'react';
import "./Print.scss";

const Print = ({data}) => {
    return (
        <div className={"item__print"}>
            <div className={"item__overlay"}>
                <div className="hide" style={{top:0}}></div>
                <div className="hide" style={{bottom:0}}></div>
            </div>
            <iframe title="Луна Китаяма" onDragStart={e => e.preventDefault()}
                    src={data.url}
                    allowtransparency={"always"} allowFullScreen={true}></iframe>
        </div>
    );
};

export default Print;