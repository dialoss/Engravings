import React, {useEffect} from 'react';
import {useAddEvent} from "../../hooks/useAddEvent";

const ThemeManager = () => {
    function setEdit() {
        const itemList = document.querySelector('.item-list');
        if (!itemList) return;
        if (window.editPage) itemList.classList.add('edit');
        else itemList.classList.remove('edit');
    }
    useAddEvent('keydown', e => {
        e.ctrlKey && e.altKey && e.code === 'KeyE' && (window.editPage = !window.editPage);
        setEdit();
    })
    useEffect(() => {
        window.editPage = true;
        setEdit();
    }, []);
    useAddEvent('theme:toggle', () => {
        window.editPage = !window.editPage;
        setEdit();
    });
    return (
        <></>
    );
};

export default ThemeManager;