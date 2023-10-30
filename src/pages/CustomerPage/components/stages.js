import chroma from "chroma-js";

export const Stages = [
    {
        type: 'primary',
        next: 4,
        color: "#d22626",
        text: 'Подготовка материала',
    },
    {
        type: 'secondary',
        text: 'Расточил',
    },
    {
        type: 'secondary',
        text: 'Вырезал',
    },
    {
        type: 'secondary',
        text: 'Сделал',
    },
    {
        type: 'primary',
        next: 3,
        color: "#a97117",
        text: 'Фрезеровка',
    },
    {
        type: 'secondary',
        text: 'Подготовил',
    },
    {
        type: 'secondary',
        text: 'Установил',
    },
    {
        type: 'primary',
        next: 3,
        color: "#a6ae09",
        text: 'Сборка',
    },
    {
        type: 'secondary',
        text: 'Собрал',
    },
    {
        type: 'secondary',
        text: 'Настроил',
    },
    {
        type: 'primary',
        next: 2,
        color: "#74d50d",
        text: 'Упаковка',
    },
    {
        type: 'secondary',
        text: 'Сделал упаковку',
    },
    {
        type: 'primary',
        next: 0,
        color: "#0e6900",
        text: 'Отправлено',
    },
]

export function prepareColors(data) {
    let stages = structuredClone(data);
    let all = 0;
    let cur = 0;
    let grad = null;
    for (let i = 0; i < stages.length; i++) {
        let stage = stages[i];

        if (stages[i].type === 'primary') {
            all = stages[i].next - 1;
            cur = 0;
            grad = chroma.scale([stage.color, stages[i + stage.next].color]);
        }

        stages[i].color = {
            top: grad(cur / all),
            bottom: grad((cur + 1) / all),
        };

        // cur += 1;
    }
    return stages;
}