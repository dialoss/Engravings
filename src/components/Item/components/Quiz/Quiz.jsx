import React from 'react';
import "./Quiz.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const Quiz = ({quiz, callback}) => {
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
                        {quiz.started ? <div className="quiz__body">
                            <div className="quiz__title">{quiz.data.question}</div>
                            <div className="quiz__choices">
                                {
                                    quiz.data.choices.map((c, i) =>
                                        <div className={"quiz__button quiz__choice " +
                                            (quiz.userAnswer.choice === c &&
                                                (quiz.userAnswer.correct ? 'correct' : 'wrong'))} key={i}
                                             onClick={() => callback('USER_ANSWER', c)}>{c}</div>)
                                }
                            </div>
                            {quiz.userAnswer.question &&
                                <div className={"quiz__answer"}>
                                    {quiz.userAnswer.correct ? <p>Верно!</p> : <p>Неверно! Правильный ответ: {quiz.data.answer}</p>}
                                    <div className="quiz__button quiz__next" onClick={() => callback("NEXT")}>
                                        Дальше
                                    </div>
                                </div>}
                        </div> : <div className={"quiz__body"}>
                            {quiz.all === quiz.current + 1 && <div className={"quiz__end"}>
                                <p className={"quiz__end-text"}>Конец!</p>
                                <img src={require('./celebration-icon-png-7.jpg')} alt=""/>
                            </div>}
                            {!quiz.started && <div className="quiz__button quiz__play" onClick={() => callback("START")}>
                                Играть
                            </div>}
                        </div>}
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
};

export default Quiz;