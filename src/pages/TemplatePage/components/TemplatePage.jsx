import React, {useState} from 'react';
import {Footer} from "modules/Footer";
import ContentWrapper from "ui/ContentWrapper/ContentWrapper";
import {AppRouter} from "pages/AppRouter";
import {BrowserRouter, HashRouter} from "react-router-dom";
import ActionManager from "modules/ActionManager/components/ActionManager";
import Container from "../../../ui/Container/Container";
import PageComments from "../../../components/PageComments/PageComments";

const TemplatePage = () => {
    return (
        <>
            <BrowserRouter>
                <ContentWrapper>
                    <div style={{minHeight: '100dvh'}}>
                        <AppRouter/>
                        <div style={{flexGrow: 1, minHeight:1}}></div>
                    </div>
                    <PageComments/>
                    <div style={{flexGrow: 1, minHeight:1}}></div>
                    <ActionManager></ActionManager>
                </ContentWrapper>
                <Footer></Footer>
            </BrowserRouter>
        </>
    );
};

export default TemplatePage;