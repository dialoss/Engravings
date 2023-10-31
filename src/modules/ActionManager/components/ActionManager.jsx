import React, {useEffect, useState} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {setActionElement} from "./helpers";
import EditorManager from "components/EditorManager/EditorManager";
import ObjectTransform from "ui/ObjectTransform/ObjectTransform";
import CarouselContainer from "components/Modals/Carousel/CarouselContainer";
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


const ActionManager = () => {
    function initAction(event) {
        setActionElement(event.detail);
    }
    function actionCallback(event) {
        Actions.action(event.detail);
    }
    function closePrompt() {
        setPrompt(p => ({...p, isOpened:false}));
    }
    useAddEvent('action:init', initAction);
    useAddEvent('action:callback', actionCallback)

    const [prompt, setPrompt] = useState({isOpened: false, text: '', data:{}, button:''});
    useAddEvent('user-prompt', (event) => setPrompt({isOpened: true, ...event.detail}))
    console.log('pr', prompt)
    const user = useSelector(state => state.users.current);
    return (
        <>
            {user.isAdmin &&
                <>
                    <ItemActions></ItemActions>
                    <EditorManager></EditorManager>
                    <FileExplorer></FileExplorer>
                </>
            }
            <ModalManager name={'user-prompt:toggle'}
                          defaultOpened={prompt.isOpened}
                          callback={closePrompt}
                          closeConditions={['btn']}>
                <div className={"user-prompt"} style={{bg:'bg-none', win:'centered', boxShadow:'0 0 2px 2px grey', borderRadius:8}}>
                    <FormContainer formData={prompt} callback={closePrompt}>
                    </FormContainer>
                </div>
            </ModalManager>
            <ActionForm></ActionForm>
            <ObjectTransform></ObjectTransform>
            <FirebaseContainer></FirebaseContainer>
            <CarouselContainer></CarouselContainer>
            <MessengerContainer></MessengerContainer>
        </>
    );
};

export default ActionManager;