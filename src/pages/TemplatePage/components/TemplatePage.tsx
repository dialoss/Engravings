//@ts-nocheck
import React from 'react';
import ContentWrapper from "ui/ContentWrapper/ContentWrapper";
import {AppRouter} from "pages/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Footer from "../../../ui/gravur/Footer";
import Navigation from "../../../components/Navigation/Navigation";
import ActionManager from "../../../modules/ActionManager/components/ActionManager";

const TemplatePage = () => {
    return (
        <BrowserRouter>
            <ContentWrapper>
                <Navigation></Navigation>
                <ActionManager></ActionManager>
                <div style={{minHeight: '100dvh'}}>
                    <AppRouter/>
                    <div style={{flexGrow: 1, minHeight:1}}></div>
                </div>
                <div style={{flexGrow: 1, minHeight:1}}></div>
            </ContentWrapper>
            <Footer></Footer>
        </BrowserRouter>
    );
};

export default TemplatePage;