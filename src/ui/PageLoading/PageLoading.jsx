import React from 'react';
import loadingGif from 'assets/gifs/loading.gif';
import 'styles/ui/PageLoading.scss';
import Container from "ui/Container/Container";

const PageLoading = () => {
    return (
        <Container>
            <div className="page-loading">
                <img src={loadingGif} alt=""/>
            </div>
        </Container>
    );
};

export default PageLoading;