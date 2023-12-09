import React, {useState} from 'react';
import {useAddEvent} from "../../hooks/useAddEvent";
import ModalForm from "../ActionForm/FormContainer";
import {useAppSelector} from "hooks/redux";

const form = {
    title: 'Выберите страницы для получения уведомлений',
    button: 'Подтвердить',
    data: {},
}

const NotificationManager = () => {
    const pages = useAppSelector(state => state.location).pages;

    Object.values(pages).forEach(p => form.data[p.title] = {
        name: p.path,
        type: 'checkbox',
        label: p.title || p.path,
        value: false,
    });
    console.log(form)
    console.log(pages)
    useAddEvent('notifications:dialog');
    return (
        <ModalForm name={'notifications'} data={form}></ModalForm>
    );
};

export default NotificationManager;