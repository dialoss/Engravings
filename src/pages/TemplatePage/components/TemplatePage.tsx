//@ts-nocheck
import React from 'react';
import {BrowserRouter} from "react-router-dom";
import Footer from "../../../ui/gravur/Footer";
import Navigation from "../../../components/Navigation/Navigation";
import AppRoutes from "../../AppRoutes";
import ImageViewer from "../../../ui/ImageViewer/ImageViewer";

const TemplatePage = () => {
    return (
        <BrowserRouter>
            <Navigation></Navigation>
            <AppRoutes></AppRoutes>
            <div style={{flexGrow: 1, minHeight:1}}></div>
            <Footer></Footer>
            <ImageViewer></ImageViewer>
        </BrowserRouter>
    );
};

export default TemplatePage;