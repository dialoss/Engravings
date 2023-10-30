import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";

const ContentWrapper = ({children}) => {
    return (
        <TransformContainer className={'viewport-container'} height={'fixed'}>
            <div className="content-wrapper">
                <div className="content">
                    {children}
                </div>
            </div>
        </TransformContainer>

    );
};

export default ContentWrapper;