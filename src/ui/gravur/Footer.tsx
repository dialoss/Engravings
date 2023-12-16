import React from 'react';
import "./Footer.scss";
import Container from "../Container/Container";

const social = [
    {
        name: 'vk',
        link: 'https://vk.com/publichka_spb',
    },
    {
        name: 'ok',
        link: 'https://ok.ru/group/61598925455430',
    },
    {
        name: 'rt',
        link: 'https://rutube.ru/channel/26300910/videos/',
    },{
        name: 'dz',
        link: 'https://dzen.ru/publichka_spb',
    },
    {
        name: 'lj',
        link: 'https://nlr-spb.livejournal.com/',
    },
    {
        name: 'tg',
        link: 'https://t.me/nationallibraryofrussia',
    },
]

const Footer = () => {
    return (
        <div className={"footer"}>
                <div className="footer__inner">
                    <Container>
                    <div className="main">
            <div className="left">
                <div className="logo">
                    <img src={require("./assets/logo.png")} alt=""/>
                </div>
                <div className="working">
                    <p className="title">Часы работы:</p>
                    <p>с 1 сентября по 30 июня:</p>
                        <p>пн-пт: 9:00-21:00</p>
                        <p>сб, вс: 11:00-19:00</p>
                </div>
            </div>
            <div className="right">
                <div className="contact">
                    <p className={'title'}>Связаться с нами:</p>
                    <p>тел.: 8-800-100-01-96, 8(812)310-71-37</p>
                    <p>e-mail: office@nlr.ru</p>
                </div>
                <div className="social">
                    {
                        social.map(s =>
                            <a className="item" href={s.link} target={"_blank"}>
                                <img src={require('./assets/' + s.name + ".png")} alt=""/>
                            </a>
                        )
                    }
                </div>
            </div>
                    </div>
                    </Container>
            <div className="bottom">
                <img src={require("./assets/head1.png")} alt=""/>
            </div>
                </div>


        </div>
    );
};

export default Footer;