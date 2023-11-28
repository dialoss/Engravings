import React from 'react';
import "./Alert.scss";
import {AlertTitles} from "./config";
import Spinner from "../Spinner/Spinner";
const Alert = ({data}) => {
    return (
        <div className={'alert-message ' + data.type}>
            {data.type === 'loader' && <Spinner type={'inline'}></Spinner>}
            <p className={'title'}>{AlertTitles[data.type]}</p>
            <p className={'body'}>{data.body}</p>
        </div>
    );
};

export default Alert;