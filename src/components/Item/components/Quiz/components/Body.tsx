//@ts-nocheck
import React, {useContext} from 'react';
import {IQuiz, QuizContext} from "../QuizContainer";

const Body = ({quiz} : {quiz: IQuiz}) => {
    const callback = useContext(QuizContext)
    return (
        <>
        {quiz.started ? <div className="quiz__body">
            <h3 className="quiz__title">
                <p className={"quiz__all"}>Вопрос №{Math.max(quiz.current)}/{quiz.all}</p>
                {quiz.data.question}</h3>
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
                    <h3 className="quiz__title">
                        <p className={"quiz__all"}>Всего ответов: {quiz.all}</p>
                        <p className={"quiz__right"}>Правильные: {quiz.right}</p>
                        <p className={"quiz__wrong"}>Неправильные: {quiz.wrong}</p>
                    </h3>
                    <img src={require('../media/end.jpg')} style={{margin: "0 auto"}} alt=""/>
                    <div className="quiz__button quiz__play" onClick={() => callback("START")}>
                        Заново
                    </div>
                </div>}
            </div>}
        </>
    );
};

export default Body;