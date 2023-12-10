//@ts-nocheck
import React, {useRef} from 'react';
import "./ContentWrapper.scss";
import {getElementByType, triggerEvent} from "../../helpers/events";
import {storage} from "../../modules/FileExplorer/api/storage";
import {UploadStatus} from "../../modules/FileExplorer/api/google";
import {getLocation} from "../../hooks/getLocation";
import {useAppSelector} from "../../hooks/redux";

const ContentWrapper = ({children}) => {
    const ref = useRef<HTMLElement>(null);
    const page = useAppSelector(state => state.location.currentPage);
    console.log(page)
    return (
        <div className={'viewport-container transform-item'}
             data-type={'page'}
             data-id={page.id} ref={ref}>
            <div className="content-wrapper"
                 onDrop={e => {
                if (getElementByType(e, 'modal')) return;
                storage.transferFiles(e, (status: UploadStatus) => console.log(status)).then(files => {
                    window.actions.request(files.map(f => window.actions.prepareRequest('POST', f)));
                });
            }} onDragOver={(e) => e.preventDefault()}>
                {children}
            </div>
        </div>
    );
};

export default ContentWrapper;