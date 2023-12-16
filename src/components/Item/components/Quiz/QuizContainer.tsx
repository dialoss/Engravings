//@ts-nocheck
import React, {createContext, ReducerState, useLayoutEffect, useReducer} from 'react';
import Quiz from "./Quiz";
import {fetchRequest} from "api/requests";

interface QuizData {
    question: string,
    choices: string[],
    answer: string,
    image: string;
}

export interface IQuiz {
    current: number,
    right: number,
    wrong: number,
    all: number,
    dataAll: QuizData[],
    data: QuizData,
    userAnswer: {
        correct: boolean,
        choice: number,
        question: string,
    },
    started: boolean,
}

const emptyQuiz : IQuiz = {
    current: 0,
    right: 0,
    wrong: 0,
    all: 0,
    dataAll: [],
    data: {question: '', answer: '', choices: [], image:''},
    userAnswer: {
        correct: false,
        choice: 0,
        question: '',
    },
    started: false,
};

enum QuizActions {
    USER_ANSWER = "USER_ANSWER",
    NEXT = "NEXT",
    START = "START",
    SET_DATA = "SET_DATA",
}

interface QuizAction {
    type: QuizActions,
    payload?: any,
}

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function prepareData(index, data: QuizData[]) {
    const quiz = {...data[index++]};
    shuffle(quiz.choices);
    return quiz;
}

function reducer(state=emptyQuiz, action : QuizAction) {
    switch (action.type) {
        case QuizActions.USER_ANSWER:
            if (action.payload.correct) state.right++;
            else state.wrong++;
            return {...state, userAnswer: action.payload};
        case QuizActions.NEXT:
            if (state.current === state.dataAll.length - 1) return {...state, started: false};
            state.data = prepareData(++state.current, state.dataAll);
            state.userAnswer = {
                correct: false,
                choice: 0,
                question: '',
            };
            return {...state};
        case QuizActions.START:
            const quiz = {...emptyQuiz};
            quiz.dataAll = state.dataAll;
            quiz.all = quiz.dataAll.length;
            quiz.started = true;
            quiz.data = prepareData(0, state.dataAll);
            return quiz;
        case QuizActions.SET_DATA:
            state.dataAll = action.payload;
            return {...state};
    }
}

export const QuizContext = createContext<(...args: any[]) => void>(()=>{});


const QuizContainer = ({data}) => {
    const [quiz, dispatch] = useReducer(reducer, emptyQuiz as ReducerState<IQuiz>);
    useLayoutEffect(() => {
        fetchRequest(data.url).then((data) => {
            dispatch({type: QuizActions.SET_DATA, payload: data.data as QuizData[]});
            dispatch({type: QuizActions.START});
        })
    }, []);

    function callback(type, payload='') {
        if (type === QuizActions.USER_ANSWER) {
            if (quiz.userAnswer.question) return;
            const correct = payload.toLowerCase() === quiz.data.answer.toLowerCase();
            payload = {choice:payload,correct, question:quiz.data.question};
            // setTimeout(() => {
            //     dispatch({type: QuizActions.NEXT});
            // }, 3000);
        }
        dispatch({type, payload})
    }
    return (
        <QuizContext.Provider value={callback}>
            <Quiz quiz={quiz}></Quiz>
        </QuizContext.Provider>
    );
};

export default QuizContainer;