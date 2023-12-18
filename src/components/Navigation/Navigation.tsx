//@ts-nocheck
import React, {useState} from 'react';
import Container from "../../ui/Container/Container";
import "./Navigation.scss";
import {Link} from "react-router-dom";
import {useAddEvent} from "../../hooks/useAddEvent";
import {ROUTES} from "../../pages/AppRoutes";

const Navigation = () => {
    const [scroll,setScroll]=useState(0);
    useAddEvent("scroll", (e) => {
        setScroll(window.scrollY);
    })
    return (
        <div className={"navigation"} style={{'--scroll':scroll}}>
            <Container>
                <div className="navigation__inner">
                    {
                        ROUTES.map(r => <Link to={r.path}>{r.text}</Link>)
                    }
                </div>
            </Container>
        </div>
    );
};

export default Navigation;