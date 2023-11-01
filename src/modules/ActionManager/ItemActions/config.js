
export const ContextActions = {
    'add':{
        text: 'Добавить',
        argument: null,
        actions: {
            'addQuick': {
                argument: false,
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