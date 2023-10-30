import React, {useLayoutEffect, useState} from 'react';
import Footer from "ui/Footer/Footer";
import {getLocation} from "hooks/getLocation";
import {sendLocalRequest} from "api/requests";
import {useSelector} from "react-redux";

const FooterContainer = () => {
    const [views, setViews] = useState({curViews: 0, totalViews: 0});
    const location = useSelector(state => state.location);
    useLayoutEffect(() => {
        (async () => {
            const response = await sendLocalRequest('/api/pages/?views');
            setViews(response);
        })();
    }, [location.relativeURL]);
    return (
        <Footer totalViews={views.totalViews} currentViews={views.currentViews}></Footer>
    );
};

export default FooterContainer;