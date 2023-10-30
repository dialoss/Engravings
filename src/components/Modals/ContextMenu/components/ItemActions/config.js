
export const ContextActions = {
    'add':{
        text: 'Добавить',
        argument: null,
        actions: {
            'addQuick': {
                argument: false,
                text: 'Quick New',
            },
            'entry': {
                callback: 'add',
                argument: false,
                text: 'Запись',
            },
            'items': {
                argument: null,
                text: 'Предметы',
                actions: {
                    'textfield': {
                        callback: 'add',
                        argument: true,
                        text: 'Текст',
                    },
                    'price': {
                        callback: 'edit',
                        argument: true,
                        text: 'Цена',
                    },
                }
            }
        }
    },
    'edit':{
        text: 'Редактировать',
        argument: false,
        actions: {
            'item': {
                argument: null,
                text: 'Предметы',
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
                }
            },
            'entry': {
                argument: null,
                text: 'Запись',
                actions: {
                    'show_date': {
                        callback: 'edit',
                        argument: true,
                        text: 'Показывать дату',
                    },
                }
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