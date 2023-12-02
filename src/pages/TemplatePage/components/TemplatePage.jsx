import React, {useState} from 'react';
import {Footer} from "modules/Footer";
import ContentWrapper from "ui/ContentWrapper/ContentWrapper";
import {AppRouter} from "pages/AppRouter";
import {BrowserRouter, HashRouter} from "react-router-dom";
import StaticContent from "../../StaticContent/StaticContent";
import NavbarContainer from "../../../components/Navbar/NavbarContainer";

const TemplatePage = () => {
    return (
        <BrowserRouter>
            <NavbarContainer></NavbarContainer>
            <ContentWrapper>
                <div style={{minHeight: '100dvh'}}>
                    <AppRouter/>
                    <div style={{flexGrow: 1, minHeight:1}}></div>
                </div>
                <div style={{flexGrow: 1, minHeight:1}}></div>
                <StaticContent></StaticContent>
            </ContentWrapper>
            <Footer></Footer>
        </BrowserRouter>
    );
};

export default TemplatePage;