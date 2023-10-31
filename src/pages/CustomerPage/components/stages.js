import chroma from "chroma-js";

export const Stages = [
    {
        style: 'primary',
        next: 4,
        color: "#d22626",
        title: 'Подготовка материала',
    },
    {
        style: 'secondary',
        title: 'Расточил',
    },
    {
        style: 'secondary',
        title: 'Вырезал',
    },
    {
        style: 'secondary',
        title: 'Сделал',
    },
    {
        style: 'primary',
        next: 3,
        color: "#a97117",
        title: 'Фрезеровка',
    },
    {
        style: 'secondary',
        title: 'Подготовил',
    },
    {
        style: 'secondary',
        title: 'Установил',
    },
    {
        style: 'primary',
        next: 3,
        color: "#a6ae09",
        title: 'Сборка',
    },
    {
        style: 'secondary',
        title: 'Собрал',
    },
    {
        style: 'secondary',
        title: 'Настроил',
    },
    {
        style: 'primary',
        next: 2,
        color: "#74d50d",
        title: 'Упаковка',
    },
    {
        style: 'secondary',
        title: 'Сделал упаковку',
    },
    {
        style: 'primary',
        next: 0,
        color: "#0e6900",
        title: 'Отправлено',
    },
]

export function prepareColors(data) {
    let stages = structuredClone(data);
    let all = 0;
    let cur = 0;
    let grad = null;
    for (let i = 0; i < stages.length; i++) {
        let stage = stages[i];

        if (stages[i].style === 'primary') {
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