//@ts-nocheck
import React from 'react';
import "./ContentWrapper.scss";
import {getElementByType} from "../../helpers/events";
import {useAppSelector} from "../../hooks/redux";
import TransformItem from "../ObjectTransform/components/TransformItem/TransformItem";

const ContentWrapper = ({children}) => {
    const page = useAppSelector(state => state.location.currentPage);
    return (
        <TransformItem className={'viewport-container'} type={'page'} id={page.id} style={{}}>
            <div className="content-wrapper"
                 onDrop={e => {
                     if (getElementByType(e, 'modal')) return;
                     window.actions.elements.selectFromCursor(e);
                     window.filemanager.transferFiles(e, true).then(files =>
                         window.actions.request('POST', files))
                 }} onDragOver={(e) => e.preventDefault()}>
                {children}
            </div>
        </TransformItem>
    );
};

export default ContentWrapper;