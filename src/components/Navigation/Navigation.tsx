//@ts-nocheck
import React, {useLayoutEffect, useState} from 'react';
import Container from "../../ui/Container/Container";
import "./Navigation.scss";
import {Link, useNavigate} from "react-router-dom";
import {useAddEvent} from "../../hooks/useAddEvent";
import {ROUTES} from "../../pages/AppRoutes";

const Navigation = () => {
    const nav = useNavigate();
    const [page, setPage] = useState({hide:true});
    useLayoutEffect(() => {
        setPage(ROUTES.find(r => r.path === window.location.pathname) || {});
    }, [nav]);
    const [scroll,setScroll]=useState(0);
    useAddEvent("scroll", (e) => {
        setScroll(window.scrollY);
    });
    useAddEvent("navigation", e => nav(e.detail));

    function anchor(e, route) {

        const yOffset = -70;
        const element = document.querySelector("#" + route.anchor);
        if (!element) return;
        e.preventDefault();
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({top: y, behavior: 'smooth'});
    }

    return (
        <div className={"navigation " + (page.hide ? "hide" : "")} style={{'--scroll': scroll}}>
            <Container>
                <div className="navigation__inner">
                    {
                        ROUTES.map(r => r.text &&
                            <Link to={r.path} onClick={e => anchor(e, r)} key={r.path}>{r.text}</Link>)
                    }
                </div>
            </Container>
        </div>
    );
};

export default Navigation;