//@ts-nocheck
import React from 'react';
import "./ItemList.scss";
import Carousel from "../../ui/gravur/Carousel";
import {PRINTS, SECTIONS} from "./config";
import MyMasonry from "../../ui/Masonry/MyMasonry";
import Print from "../Item/components/Print/Print";
import {useNavigate} from "react-router-dom";
import {triggerEvent} from "../../hooks/events";
import PageAnimation from "../../ui/PageAnimation";

const Wrapper = ({children}) => {
    return (
        <div className="wrapper">
            <PageAnimation>
                {children}
            </PageAnimation>
        </div>
    );
}

const Section = ({className, id='', children}) => {
    return (
        <div id={id} className={className + " section"}>
            {id === "intro" && <img className={"intro-img"} src="https://lh3.googleusercontent.com/pw/ABLVV87GzL80Jc-zwdQpuO17DIPtgCdf0yRxuCmS8QmTQXYndhLn_jioN-G3O9Mi1eNmzFp1LOnZli7lUpC82V5yAbYaltA2_3QSxYINBcfLJ-HaT4t1ZQ=w1800" alt=""/>}
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
            <div className="image-wrapper">
                <Image data={d}></Image>
            </div>
        </div>
    );
}

export const Main = () => {
    return (
        <Wrapper>
            <Section className={'bl intro'} id={"intro"}>
                <div className="text">
                    <p className="title">Японские гравюры</p>
                    <p>Цукиока Ёситоси</p>
                </div>
            </Section>
            <Section className={'yl wide'}>
                <div className="title" style={{textAlign:'center'}}>Гравюры</div>
                <Carousel items={PRINTS.slice(0, 6)} element={Gravur}></Carousel>
                <Carousel items={PRINTS.slice(6, 12)} element={Gravur} reversed={true}></Carousel>
            </Section>
            <Section className={'bl'} id={"about"}>
                {[0, 1].map(i => <Description i={i}></Description>)}
            </Section>
            <Section className={'yl'}>
                {[2, 3, 4, 5].map(i => <Description i={i}>
                    {i === 5 && <Description i={6}></Description>}
                </Description>)}
            </Section>
        </Wrapper>
    );
}

const Gravur = ({data}) => {
    return (
        <div className={"print-wrapper"} onClick={() => triggerEvent("navigation", "description/" + data.id)}>
            <div className="gravur shadow">
                <Image data={data}></Image>
            </div>
            <p className="title">{data.title}</p>
            <p>{data.text}</p>
        </div>
    )
}


export const All = () => {
    return (
        <Wrapper>
            <Section className={'yl'}>
                <MyMasonry maxColumns={2}>
                    {PRINTS.map((p,i) => <Gravur data={p} key={p.title}></Gravur>)}
                </MyMasonry>
            </Section>
        </Wrapper>
    );
}

const Image = ({data}) => {
    return (
        <img src={data.image} onClick={() => window.imageViewer([{...data, url:data.image}])} alt=""/>
    );
}

export const DescriptionPage = () => {
    const id = window.location.href.split('/').slice(-1);
    const data = PRINTS[id];
    return (
        <Wrapper>
            <Section className={'yl genial'}>
                <div className="wrapper">
                    <Print data={data}></Print>
                    <div className="text">
                        <p className="title">{data.title}</p>
                        <p>{data.description}</p>
                    </div>
                </div>
            </Section>
        </Wrapper>
    );
}