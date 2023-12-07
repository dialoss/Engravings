import React, {useLayoutEffect, useReducer, useState} from 'react';
import Quiz from "./Quiz";
import data from "./data/3.json";
import {prepareData} from "./helpers";

const emptyQuiz = {
    current: 0,
    right: 0,
    wrong: 0,
    all: 0,
    data: {},
    userAnswer: {
        correct: false,
        choice: 0,
        question: '',
    },
    started: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "USER_ANSWER":
            if (action.payload.correct) state.right++;
            else state.wrong++;
            return {...state, userAnswer: action.payload};
        case "NEXT":
            if (state.current === data.length - 1) return {...state, started: false};
            state.data = prepareData(++state.current);
            state.userAnswer = {
                correct: false,
                choice: 0,
                question: '',
            };
            return {...state};
        case "START":
            const quiz = {...emptyQuiz};
            quiz.all = data.length;
            quiz.started = true;
            quiz.data = prepareData(0);
            return quiz;
    }
}

const QuizContainer = () => {
    const [quiz, dispatch] = useReducer(reducer, {});

    function callback(type, payload='') {
        if (type === 'USER_ANSWER') {
            if (quiz.userAnswer.question) return;
            const correct = payload.toLowerCase() === quiz.data.answer.toLowerCase();
            payload = {choice:payload,correct, question:quiz.data.question};
        }
        dispatch({type, payload})
     // setTimeout(() => {
        //     dispatch({type: 'NEXT', payload: correct});
        // }, 500);
    }
    console.log(quiz)
    return (

        <Quiz quiz={quiz} callback={callback}></Quiz>

    );
};

export default QuizContainer;