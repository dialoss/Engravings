//@ts-nocheck
import React, {useLayoutEffect, useState} from 'react';
import "./DelayedVisibility.scss";

const DelayedVisibility = ({trigger, timeout, children, className, style={}}) => {
    const [visible, setVisible] = useState(false);

    useLayoutEffect(() => {
        setVisible(false);
        setTimeout(()=>{setVisible(true)},timeout);
    }, [trigger]);
    return (
        <div className={'delayed-visibility ' + (className || '') + ' ' + (visible ? 'visible':'hidden')} style={style}>
            {children}
        </div>
    );
};

export default DelayedVisibility;