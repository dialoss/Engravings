import React, {useEffect, useState} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {setActionElement} from "./helpers";
import ObjectTransform from "ui/ObjectTransform/ObjectTransform";
import MessengerContainer from "../../../components/Messenger/MessengerContainer";
import Actions from "modules/ActionManager/ItemActions/actions";
import {useSelector} from "react-redux";
import FileExplorer from "../../FileExplorer/FileExplorer";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import ItemActions from "../ItemActions/EntryActions";
import ThemeManager from "../../../components/ItemList/ThemeManager";
import AuthContainer from "../../Authorization/AuthContainer";
import AlertContainer from "../../../ui/Alert/AlertContainer";
import ModalForm from "../../ActionForm/FormContainer";
import {CarouselModal} from "../../../components/Modals/Carousel/CarouselContainer";


const ActionManager = () => {
    function initAction(event) {
        setActionElement(event.detail);
    }
    function actionCallback(event) {
        Actions.action(event.detail);
    }
    function actionFunction(event) {
        const fName = event.detail.name;
        const args = event.detail.args;
        Actions.action(Actions[fName](args));
    }

    useAddEvent('action:init', initAction);
    useAddEvent('action:callback', actionCallback);
    useAddEvent('action:function', actionFunction);

    const user = useSelector(state => state.users.current);
    return (
        <>
            {user.isAdmin &&
                <>
                    <ItemActions></ItemActions>
                    <ModalForm name={'element-form'}></ModalForm>
                    <FileExplorer></FileExplorer>
                    <AlertContainer></AlertContainer>
                    <ThemeManager></ThemeManager>
                </>
            }
            <ObjectTransform></ObjectTransform>
            <FirebaseContainer></FirebaseContainer>
            <MessengerContainer></MessengerContainer>
            <AuthContainer></AuthContainer>
            <CarouselModal></CarouselModal>
            <ModalForm name={'user-prompt'} backgroundClose={false}></ModalForm>
        </>
    );
};

export default ActionManager;