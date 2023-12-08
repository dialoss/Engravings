import React, {ReducerState, useLayoutEffect, useReducer, useState} from 'react';
import Quiz from "./Quiz";
import data from "./data/3.json";
import {prepareData} from "./helpers";

interface QuizData {
    question: string,
    choices: string[],
    answer: string,
}

export interface IQuiz {
    current: number,
    right: number,
    wrong: number,
    all: number,
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
    data: {question: '', answer: '', choices: []},
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
    START = "START"
}

interface QuizAction {
    type: QuizActions,
    payload?: object,
}

function reducer(state=emptyQuiz, action : QuizAction) {
    switch (action.type) {
        case QuizActions.USER_ANSWER:
            if (action.payload.correct) state.right++;
            else state.wrong++;
            return {...state, userAnswer: action.payload};
        case QuizActions.NEXT:
            if (state.current === data.length - 1) return {...state, started: false};
            state.data = prepareData(++state.current);
            state.userAnswer = {
                correct: false,
                choice: 0,
                question: '',
            };
            return {...state};
        case QuizActions.START:
            const quiz = {...emptyQuiz};
            quiz.all = data.length;
            quiz.started = true;
            quiz.data = prepareData(0);
            return quiz;
    }
}

const QuizContainer = () => {
    const [quiz, dispatch] = useReducer(reducer, emptyQuiz as ReducerState<IQuiz>);

    function callback(type, payload='') {
        if (type === QuizActions.USER_ANSWER) {
            if (quiz.userAnswer.question) return;
            const correct = payload.toLowerCase() === quiz.data.answer.toLowerCase();
            payload = {choice:payload,correct, question:quiz.data.question};
        }
        dispatch({type, payload})
    }
    return (
        <Quiz quiz={quiz}></Quiz>
    );
};

export default QuizContainer;