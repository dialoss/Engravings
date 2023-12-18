//@ts-nocheck
import React from 'react';
import "./ItemList.scss";
import Carousel from "../../ui/gravur/Carousel";
import {PRINTS, SECTIONS} from "./config";
import MyMasonry from "../../ui/Masonry/MyMasonry";
import Print from "../Item/components/Print/Print";
import {useNavigate} from "react-router-dom";
import {triggerEvent} from "../../hooks/events";

const Section = ({className, id='', children}) => {
    return (
        <div id={id} className={className + " section"}>
            <div className={'item-container'}>
                {children}
            </div>
        </div>
    );
}

export const Description = ({i, children}) => {
    const d = SECTIONS[i];
    return (
        <div className={"description " + d.order} data-id={i}>
            <div className="text">
                <p className="title">{d.title}</p>
                <p>{d.text}</p>
                <div className="text extra">
                    {children}
                </div>
            </div>
            <img src={d.image} alt=""/>
        </div>
    );
}

export const Main = () => {
    return (
        <div className="wrapper">
            <Section className={'bl intro'}>
                <div className="text">
                    <p className="title">Японские гравюры</p>
                    <p>Цукиока Ёситоси</p>
                </div>
            </Section>
            <Section className={'yl wide'}>
                <div className="title" style={{textAlign:'center'}}>Гравюры</div>
                <Carousel items={PRINTS.slice(0, 6)} element={Gravur}></Carousel>
                <Carousel items={PRINTS.slice(6, 12)} element={Gravur}></Carousel>
            </Section>
            <Section className={'bl'} id={"about"}>
                {[0, 1].map(i => <Description i={i}></Description>)}
            </Section>
            <Section className={'yl'}>
                {[2, 3, 4, 5].map(i => <Description i={i}>
                    {i === 5 && <Description i={6}></Description>}
                </Description>)}
            </Section>
        </div>
    );
}

const Gravur = ({data}) => {
    return (
        <div className={"print-wrapper"} onClick={() => triggerEvent("navigation", "description/" + data.id)}>
            <div className="gravur shadow">
                <img src={data.image} alt=""/>
            </div>
            <p className="title">{data.title}</p>
            <p>{data.text}</p>
        </div>
    )
}


export const All = () => {
    return (
        <Section className={'yl'}>
            <MyMasonry maxColumns={2}>
                {PRINTS.map((p,i) => <Gravur data={{...p,id:i}} key={p.title}></Gravur>)}
            </MyMasonry>
        </Section>
    );
}

export const DescriptionPage = ({id}) => {
    const data = PRINTS[id];
    return (
        <Section className={'yl'}>
            <div className="wrapper">
                <Print url={data.url}></Print>
                <div className="text">
                    <p className="title">{data.title}</p>
                    <p>{data.text}</p>
                </div>
            </div>
        </Section>
    );
}