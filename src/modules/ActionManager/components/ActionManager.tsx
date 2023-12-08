import React, {useEffect, useState} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {setActionElement} from "./helpers";
import MessengerContainer from "../../../components/Messenger/MessengerContainer";
import Actions from "modules/ActionManager/ItemActions/actions";
import {useSelector} from "react-redux";
import FileExplorer from "../../FileExplorer/FileExplorer";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import ItemActions from "../ItemActions/ItemActions";
import ThemeManager from "../../../components/ItemList/ThemeManager/ThemeManager";
import AuthContainer from "../../Authorization/AuthContainer";
import AlertContainer from "../../../ui/Alert/AlertContainer";
import ModalForm from "../../ActionForm/FormContainer";
import {CarouselModal} from "../../../components/Modals/Carousel/CarouselContainer";
import NotificationManager from "../../Notifications/NotificationManager";
import SidebarContainer from "../../../components/Sidebar/SidebarContainer";
import ObjectTransformContainer from "../../../ui/ObjectTransform/ObjectTransform";


const ActionManager = () => {
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
            <ObjectTransformContainer></ObjectTransformContainer>
            <FirebaseContainer></FirebaseContainer>
            <MessengerContainer></MessengerContainer>
            <AuthContainer></AuthContainer>
            <CarouselModal></CarouselModal>
            <NotificationManager></NotificationManager>
            <SidebarContainer></SidebarContainer>
            <ModalForm name={'user-prompt'} backgroundClose={false}></ModalForm>
        </>
    );
};

export default ActionManager;