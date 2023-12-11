//@ts-nocheck
import React, {useContext} from 'react';
import {IQuiz, QuizContext} from "../QuizContainer";

const Body = ({quiz} : {quiz: IQuiz}) => {
    const callback = useContext(QuizContext)
    return (
        <>
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
                    <img src={require('../media/end.jpg')} alt=""/>
                </div>}
                {!quiz.started && <div className="quiz__button quiz__play" onClick={() => callback("START")}>
                    Играть
                </div>}
            </div>}
        </>
    );
};

export default Body;