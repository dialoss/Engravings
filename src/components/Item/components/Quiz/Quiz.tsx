//@ts-nocheck
import React from 'react';
import "./Quiz.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {IQuiz} from "./QuizContainer";
import Body from "./components/Body";
import DelayedVisibility from "../../../../ui/DelayedVisibility/DelayedVisibility";

const Quiz = ({quiz} : {quiz: IQuiz}) => {
    return (
        <div className={"quiz"}>
            <div className={"quiz__container"}>
                <div className={"quiz__image"}>
                    <img src={quiz.data.image} alt=""/>
                </div>
                <DelayedVisibility timeout={300} trigger={quiz.started} style={{width:"100%"}}>
                    <TransitionGroup component={null}>
                        <CSSTransition timeout={300} classNames={"quiz"} key={quiz.current}>
                            <Body quiz={quiz}></Body>
                        </CSSTransition>
                    </TransitionGroup>
                </DelayedVisibility>

            </div>
        </div>
    );
};

export default Quiz;