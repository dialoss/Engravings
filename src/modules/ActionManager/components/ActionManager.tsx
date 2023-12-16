//@ts-nocheck
import React from 'react';
import Actions, {Callbacks} from "modules/ActionManager/ItemActions/actions";
import FileExplorer from "../../FileExplorer/FileExplorer";
import ItemActions from "../ItemActions/ItemActions";
import EventManager from "../../../components/ItemList/EventManager/EventManager";
import ModalForm from "../../ActionForm/FormContainer";
import {CarouselModal} from "../../../components/Modals/Carousel/CarouselContainer";

window.actions = new Actions();
window.callbacks = new Callbacks();

const ActionManager = () => {
    return (
        <div style={{zIndex:10, position:'fixed'}}>
            <ItemActions></ItemActions>
            <ModalForm name={'element-form'}></ModalForm>
            <FileExplorer></FileExplorer>
            <EventManager></EventManager>
            <CarouselModal></CarouselModal>
            <ModalForm name={'user-prompt'} backgroundClose={false}></ModalForm>
        </div>
    );
};

export default ActionManager;