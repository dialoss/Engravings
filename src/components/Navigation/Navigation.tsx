//@ts-nocheck
import React, {useState} from 'react';
import Container from "../../ui/Container/Container";
import "./Navigation.scss";
import {Link} from "react-router-dom";
import {useAddEvent} from "../../hooks/useAddEvent";
const routes = [
    {
        text: "Главная",
        link: "main",
    },
    {
        text: "О художнике",
        link: "about",
    },
    {
        text: "Гравюры",
        link: "paintings",
    },
]

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
                        routes.map(r => <Link to={`/${r.link}/`}>{r.text}</Link>)
                    }
                </div>
            </Container>
        </div>
    );
};

export default Navigation;