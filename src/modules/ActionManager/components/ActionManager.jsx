import React, {useEffect, useState} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {setActionElement} from "./helpers";
import ObjectTransform from "ui/ObjectTransform/ObjectTransform";
import CarouselContainer, {CarouselModal} from "components/Modals/Carousel/CarouselContainer";
import {ActionForm} from "modules/ActionForm";
import MessengerContainer from "../../../components/Messenger/MessengerContainer";
import Actions from "modules/ActionManager/ItemActions/actions";
import {useSelector} from "react-redux";
import {triggerEvent} from "../../../helpers/events";
import FileExplorer from "../../FileExplorer/FileExplorer";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import Modal from "../../../ui/Modal/Modal";
import {ModalManager} from "../../../components/ModalManager";
import {FormContainer} from "../../ActionForm/FormContainer";
import ItemActions from "../ItemActions/EntryActions";
import ThemeManager from "../../../components/ItemList/ThemeManager";


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


    const [prompt, setPrompt] = useState({isOpened: false, data:{}, button:'', submitCallback: ()=>{}});

    function closePrompt(fields) {
        if (fields && prompt.submitCallback) {
            prompt.submitCallback(fields);
        }
        setPrompt(p => ({...p, isOpened:false}));
    }
    useAddEvent('user-prompt', (event) => setPrompt({...event.detail, isOpened: true}))
    console.log(prompt)
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
            <ModalManager name={'user-prompt:toggle'}
                          defaultOpened={prompt.isOpened}
                          callback={(v) => !v && closePrompt()}
                          closeConditions={['btn']}>
                <div className={"user-prompt"} style={{bg:'bg-none', win:'centered', boxShadow:'0 0 2px 2px grey', borderRadius:8}}>
                    <FormContainer formData={prompt} callback={closePrompt}>
                    </FormContainer>
                </div>
            </ModalManager>
            <ObjectTransform></ObjectTransform>
            <FirebaseContainer></FirebaseContainer>
            <CarouselModal></CarouselModal>
            {user.id && <MessengerContainer></MessengerContainer>}
        </>
    );
};

export default ActionManager;