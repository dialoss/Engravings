import React, {useLayoutEffect, useState} from 'react';
import Footer from "ui/Footer/Footer";
import {getLocation} from "hooks/getLocation";
import {sendLocalRequest} from "api/requests";
import {useSelector} from "react-redux";
import {request} from "../api/metrica";

const FooterContainer = () => {
    const [views, setViews] = useState({currentViews: 0, totalViews: 0});
    const location = useSelector(state => state.location);
    useLayoutEffect(() => {
        request(location.relativeURL).then(d => setViews(d));
    }, [location.relativeURL]);
    return (
        <Footer totalViews={views.totalViews} currentViews={views.currentViews}></Footer>
    );
};

export default FooterContainer;