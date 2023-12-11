//@ts-nocheck
import React from 'react';
import "./Quiz.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {IQuiz} from "./QuizContainer";
import Body from "./components/Body";

const Quiz = ({quiz} : {quiz: IQuiz}) => {
    const progress = (quiz.wrong + quiz.right) / quiz.all * 100;

    return (
        <div className={"quiz"}>
            <div className={"quiz__container"}>
                {quiz.started && <div className={"quiz__stats"}>
                    <div className={"quiz__progress"}>
                        <div className={"quiz__progress-slider"} style={{'--progress': progress + '%'}}></div>
                    </div>
                    <p className={"quiz__all"}>Всего вопросов: {quiz.all}</p>
                    <p className={"quiz__right"}>Правильные: {quiz.right}</p>
                    <p className={"quiz__wrong"}>Неправильные: {quiz.wrong}</p>
                </div>}
                <TransitionGroup component={null}>
                    <CSSTransition timeout={300} classNames={"quiz"} key={quiz.current}>
                        <Body quiz={quiz}></Body>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
};

export default Quiz;