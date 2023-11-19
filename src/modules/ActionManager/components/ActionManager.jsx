import React, {useEffect, useState} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {setActionElement} from "./helpers";
import ObjectTransform from "ui/ObjectTransform/ObjectTransform";
import {CarouselModal} from "components/Modals/Carousel/CarouselContainer";
import {ActionForm} from "modules/ActionForm";
import MessengerContainer from "../../../components/Messenger/MessengerContainer";
import Actions from "modules/ActionManager/ItemActions/actions";
import {useSelector} from "react-redux";
import {triggerEvent} from "../../../helpers/events";
import FileExplorer from "../../FileExplorer/FileExplorer";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import Modal from "../../../ui/Modal/Modal";
import {ModalManager} from "../../../components/ModalManager";
import {FormContainer, UserPrompt} from "../../ActionForm/FormContainer";
import ItemActions from "../ItemActions/EntryActions";
import ThemeManager from "../../../components/ItemList/ThemeManager";
import AlertContainer from "../../../ui/Alert/AlertContainer";


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
                    <FileExplorer></FileExplorer>
                    <ActionForm></ActionForm>
                    <ThemeManager></ThemeManager>
                </>
            }
            <AlertContainer></AlertContainer>
            <ObjectTransform></ObjectTransform>
            <FirebaseContainer></FirebaseContainer>
            <CarouselModal></CarouselModal>
            <MessengerContainer></MessengerContainer>
            <UserPrompt></UserPrompt>
        </>
    );
};

export default ActionManager;