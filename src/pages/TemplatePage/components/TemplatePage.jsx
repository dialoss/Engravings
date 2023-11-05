import React from 'react';
import {Footer} from "modules/Footer";
import ContentWrapper from "ui/ContentWrapper/ContentWrapper";
import {AppRouter} from "pages/AppRouter";
import {BrowserRouter} from "react-router-dom";
import {ThemeManager} from "modules/ThemeManager";
import ActionManager from "modules/ActionManager/components/ActionManager";
import Container from "../../../ui/Container/Container";

const TemplatePage = () => {
    return (
        <>
            <BrowserRouter>
                <ThemeManager>
                    <ContentWrapper>
                        <Container className={'container container-main'}>
                            <AppRouter/>
                        </Container>
                        <ActionManager></ActionManager>
                    </ContentWrapper>
                    <Footer></Footer>
                </ThemeManager>
            </BrowserRouter>
        </>
    );
};

export default TemplatePage;