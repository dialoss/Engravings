//@ts-nocheck
import React from 'react';
import "./Alert.scss";
import {AlertTitles} from "./config";
import Spinner from "../Spinner/Spinner";
import {IAlertData} from "./AlertContainer";

const Alert = ({data} : {data: IAlertData}) => {
    return (
        <div className={'alert-message ' + data.type}>
            {data.type === 'loader' && <Spinner type={'inline'}></Spinner>}
            <p className={'title'}>{AlertTitles[data.type]}</p>
            <p className={'body'}>{data.body}</p>
        </div>
    );
};

export default Alert;