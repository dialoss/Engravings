import React from 'react';
import {Footer} from "modules/Footer";
import ContentWrapper from "ui/ContentWrapper/ContentWrapper";
import {AppRouter} from "pages/AppRouter";
import {BrowserRouter} from "react-router-dom";
import ActionManager from "modules/ActionManager/components/ActionManager";
import Container from "../../../ui/Container/Container";

const TemplatePage = () => {
    return (
        <>
            <BrowserRouter>
                <ContentWrapper>
                    <Container className={'container container-main'}>
                        <AppRouter/>
                    </Container>
                    <ActionManager></ActionManager>
                </ContentWrapper>
                <Footer></Footer>
            </BrowserRouter>
        </>
    );
};

export default TemplatePage;