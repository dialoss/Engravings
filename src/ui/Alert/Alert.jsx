import React from 'react';
import "./Alert.scss";
import {AlertTitles} from "./config";
const Alert = ({data}) => {
    return (
        <div className={'alert-message ' + data.type}>
            <p className={'title'}>{AlertTitles[data.type]}</p>
            <p className={'body'}>{data.body}</p>
        </div>
    );
};

export default Alert;