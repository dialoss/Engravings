import data from "./data/2.json";

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function prepareData(index) {
    const quiz = {...data[index++]};
    shuffle(quiz.choices);
    return quiz;
}