import {actionElement} from "../components/helpers";

export const ContextActions = {
    'add':{
        text: 'Добавить',
        argument: null,
        actions: {
            'quick': {
                callback: 'add',
                argument: true,
                text: 'Quick New',
            },
            'textfield': {
                callback: 'add',
                argument: true,
                text: 'Текст',
            },
            'price': {
                callback: 'add',
                argument: true,
                text: 'Покупка',
            },
            'timeline': {
                callback: 'add',
                argument: true,
                text: 'Таймлайн',
                actions: {
                    'timeline_entry': {
                        callback: 'add',
                        argument: true,
                        text: 'Запись',
                    },
                }
            },
            'intro': {
                callback: 'add',
                argument: true,
                text: 'Шапка',
            },
            'table': {
                callback: 'add',
                argument: true,
                text: 'Таблица',
            },
        }
    },
    'edit':{
        text: 'Редактировать',
        argument: false,
        actions: {
            'clear_position': {
                callback: 'edit',
                argument: true,
                text: 'Сбросить расположение',
            },
            'clear_size': {
                callback: 'edit',
                argument: true,
                text: 'Сбросить размер',
            },
            'show_shadow': {
                callback: 'edit',
                argument: true,
                text: 'Показывать тень',
            },
            'show_date': {
                callback: 'edit',
                argument: true,
                text: 'Показывать дату',
            },
        }
    },
    'copy':{
        argument: false,
        text: 'Копировать',
    },
    'paste':{
        argument: false,
        text: 'Вставить',
    },
    'cut':{
        argument: false,
        text: 'Вырезать',
    },
    'delete':{
        argument: false,
        text: 'Удалить',
    }
}
// argument - null not callback, false no need arg, true pass name as argument
// if callback - function with  name of this value - else function with action name

export function setActionData(item) {
    switch (item) {
        case 'quick':
            return {
                type: 'base',
                description: 'Описание',
                title: 'Заголовок',
            }
        case 'table':
            return {
                width: 30,
                height: 100,
            }
        case 'textfield':
            return {
                text: "Текстовое поле"
            }
        case 'price':
            return {
                price: "999"
            }
        case 'timeline_entry':
            return {
                title: 'test'
            }
        case 'intro':
            return {
                type: 'base',
                container_width: 900,
                items: [
                    {
                        show_shadow: false,
                        movable: false,
                        type: 'subscription',
                        left: 10,
                        height: 500,
                        top: 50,
                        width: 35,
                        // container_width: 100,
                        position: 'absolute',
                    },
                    {
                        text: '<h1>Заголовок</h1>',
                        type: 'textfield',
                        movable: false,
                        left: 50,
                        top: 80,
                        width: 50,
                        show_shadow: false,
                        position: 'absolute',
                    },
                    {
                        type: 'textfield',
                        text: 'Описание',
                        top: 160,
                        width: 50,
                        left: 50,
                        show_shadow: false,
                        position: 'absolute',
                    },
                    {
                        type: 'price',
                        price: 999,
                        button: "Заказать изготовление",
                        left: 25,
                        width: 45,
                        top: 500,
                        show_shadow: false,
                        position: 'absolute',
                    }
                ]
            }
    }
    return {};
}