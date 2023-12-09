import store, {RootState} from "store";
import {getLocation} from "../../../hooks/getLocation";
import {sendEmail} from "../../../api/requests";
import {MessageManager, setCurrentRoom, updateRoom, updateUser} from "../../../components/Messenger/api/firebase";
import {adminEmail} from "../../../components/Messenger/api/config";
import {isMobileDevice, triggerEvent} from "../../../helpers/events";

export const DefaultEdit : IContextAction = {
    'clear_position': {
        callback: 'update',
        argument: true,
        text: 'Сбросить расположение',
    },
    'clear_size': {
        callback: 'update',
        argument: true,
        text: 'Сбросить размер',
    },
}

export interface IContextAction {
    [key: string]: {
        text: string,
        callback?: string | (() => void);
        argument?: boolean,
        stay_opened?: boolean,
        actions?: IContextAction;
    }
}

export const ContextActions : IContextAction = {
    'create':{
        text: 'Добавить',
        argument: true,
        stay_opened: true,
        actions: {
            'quick': {
                callback: 'create',
                argument: true,
                text: 'Новая запись',
            },
            'empty': {
                callback: 'create',
                argument: true,
                text: 'Пустая',
            },
            'textfield': {
                callback: 'create',
                argument: true,
                text: 'Текстовое поле',
            },
            'button': {
                callback: 'create',
                argument: true,
                text: 'Кнопка',
            },
            'show_more': {
                text: 'Ещё',
                stay_opened: true,
                actions: {
                    'tabs': {
                        callback: 'create',
                        argument: true,
                        text: 'Вкладки',
                    },
                    'intro': {
                        callback: 'create',
                        argument: true,
                        text: 'Шапка',
                    },
                    'shop': {
                        callback: 'create',
                        argument: true,
                        text: 'Продажа',
                    },
                    'timeline': {
                        callback: 'create',
                        argument: true,
                        text: 'Таймлайн',
                        actions: {
                            'timeline_entry': {
                                callback: 'create',
                                argument: true,
                                text: 'Запись',
                            },
                        }
                    },
                    'price': {
                        callback: 'create',
                        argument: true,
                        text: 'Цена',
                    },
                    'page': {
                        callback: 'create',
                        argument: true,
                        text: 'Страница'
                    },
                    'navigation': {
                        callback: 'create',
                        argument: true,
                        text: 'Навигация'
                    }
                }
            },
        }
    },
    'update':{
        text: 'Редактировать',
        argument: false,
        actions: {},
    },
    'media': {
        text: 'Медиа',
        actions: {
            'storage': {
                callback: () => triggerEvent("filemanager-window:toggle", {toggle:true}),
                text: 'Хранилище',
            },
            'local': {
                callback: () => triggerEvent("filemanager:local"),
                text: 'Локально',
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
        case 'page_from':
            return {
                type: 'page_from',
            }
        case 'empty':
            return {
                type: 'base',
                movable: false,
                width: '100%',
            }
        case 'quick':
            return {
                type: 'base',
                show_date: true,
                description: 'Описание',
                title: 'Заголовок',
                width: '100%',
            }
        case 'table':
            return {
                width: '30%',
                height: '100px',
            }
        case 'textfield':
            return {
                text: "Текстовое поле"
            }
        case 'button':
            return {
                width: '40%',
                style: 'nav',
                text: 'кнопка'
            }
        case 'tabs':
            return {
                "type": "base",
                "movable": false,
                style: 'tabs',
                "items": [
                    {
                        style: 'nav',
                        "type": "button",
                        "width": "35%",
                        "height": "52.75px",
                        "text": "текст",
                        "link": "$tab_0",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "width": "35%",
                        "height": "52.75px",
                        "text": "текст",
                        "link": "$tab_1",
                    }
                ]
            }
        case 'shop':
            return {
                type: 'base',
                items: [
                    {
                        type: 'subscription',
                        width: "50%",
                        container_width: 100,
                        height: '100px',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'subscription',
                        width: "50%",
                        container_width: 100,
                        height: '100px',
                        show_shadow: false,
                        movable: false,
                        items: [
                            {
                                type: 'subscription',
                                width: '100%',
                                title: 'Заголовок',
                                description: 'Описание',
                                show_shadow: false,
                                movable: false,
                            },
                            {
                                type: 'price',
                                width: '100%',
                                price: "999",
                                style: 'action',
                                text: 'Приобрести',
                                link: '$buy',
                                show_shadow: false,
                                movable: false,
                            }
                        ]
                    },
                ],
            }
        case 'price':
            return {
                price: "999",
                text: 'Приобрести',
                link: '$buy',
                style: 'action',
            }
        case "timeline":
            return {
                type: 'timeline',
                show_shadow: false,
                width: '100%',
                items: [
                    {
                        type: 'timeline_entry',
                        title: 'Подготовка материала',
                        color: '#f00',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Изготовление деталей',
                        color: '#e2b624',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Сборка',
                        color: '#0932ae',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Тестирование',
                        color: '#710dd5',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Упаковка',
                        color: '#3ddf20',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Отправлено',
                        color: '#005102',
                        show_shadow: false,
                        movable: false,
                    },
                ]
            }
        case 'timeline_entry':
            return {
                type: 'timeline_entry',
                color: '#00f',
                title: 'Заголовок',
                show_shadow: false,
                movable: false,
            }
        case 'intro':
            return {
                "type": "base",
                container_width: 1200,
                "items": [
                    {
                        "type": "base",
                        "width": "100%",
                        "items": [
                            {
                                "type": "base",
                                "width": "100%",
                                "height": "850px",
                                "items": [
                                    {
                                        "type": "subscription",
                                        "width": "70%",
                                        container_width: 100,
                                        "height": "100px",
                                        "top": "60px",
                                        "left": "0px",
                                        "position": "absolute",
                                        "movable": false,
                                        "show_shadow": false,
                                        order: 1,
                                    },
                                    {
                                        "type": "subscription",
                                        "width": "50%",
                                        "top": "50px",
                                        "left": "50%",
                                        "position": "absolute",
                                        "show_shadow": false,
                                        order: 2,
                                        "items": [
                                            {
                                                text: '<h1>Заголовок</h1>',
                                                "show_shadow": false,
                                                "type": "textfield",
                                                "width": "100%",
                                                "height": "100px",
                                                "movable": false,
                                            },
                                            {
                                                text: 'Описание',
                                                "show_shadow": false,
                                                "type": "textfield",
                                                "width": "100%",
                                                "height": "660px",
                                                "movable": false,

                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "base",
                        "width": "100%",
                        "height": "400px",
                        "items": [
                            {
                                "type": "table",
                                "width": "100%",
                                "height": "300px",
                                "url": "1TT6KWUcn4_4shc-DK--2JDR4W4_nUuPT",
                            },
                        ]
                    },
                    {
                        "type": "base",
                        "width": "100%",
                        "height": "80px",
                        "items": [
                            {
                                width: '100%',
                                style: 'action',
                                "type": "price",
                                "text": "Заказать изготовление",
                                "link": "$order",
                                "price": "<p>от 160000</p>",
                            }
                        ]
                    }
                ]
            }
        case "navigation":
            return {
                "type": "base",
                "movable": false,
                style: 'tabs',
                "items": [
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "Главная",
                        "link": "/main/",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "модели",
                        "link": "/models/",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "заказы",
                        "link": "/orders/",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "детали",
                        "link": "/parts/",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "чертежи",
                        "link": "/blueprints/",
                    },
                    {
                        style: 'nav',
                        "type": "button",
                        "text": "в продаже",
                        "link": "/shop/",
                    },
                ]
            }
        case 'order':
            actionMessage(`Здравствуйте! Я принял Ваш заказ и в скором времени свяжусь с Вами,
                     чтобы обсудить детали заказа. По любым вопросам Вы можете связаться со мной в этом чате, в комментариях 
                     на странице заказа или по почте fomenko75@mail.ru. Включите уведомления с моего сайта, чтобы всегда быть 
                      в курсе новостей.`);

            const user = store.getState().users.current;
            const location = getLocation();
            const name = user.name.replaceAll(' ', '-');
            const orderName = location.pageSlug.toUpperCase();
            const unique = JSON.stringify({customer: user.name, order: orderName});
            const page = {
                path: 'orders/' + name.toLowerCase(),
            }

            setTimeout(() => {
                triggerEvent("user-prompt", {title:'Перейти на страницу заказа?', button: 'да', submitCallback: agree => {
                        agree && triggerEvent("router:navigate", page);
                    }})
            }, 1000);

            sendEmail({
                recipient: 'matthewwimsten@gmail.com',
                type: 'order',
                subject: 'MyMount | Новый заказ',
                data: {
                    user,
                    order: orderName,
                }
            });

            return [{
                type: 'page',
                ...page,
                title: name,
            },
                {
                    unique,
                type: 'base',
                title: orderName,
                description: `Заказ ` + user.name,
                parent: '',
                page,
                items: [
                    {
                        show_shadow: false,
                        type: 'subscription',
                        title: 'Дата начала изготовления ',
                    },
                ]
                },
                {
                    ...setActionData('timeline'),
                    page,
                    unique,
                },
                {
                    unique,
                    type: 'base',
                    title: orderName,
                    description: `Заказ ` + user.name,
                    tab: 1,
                    parent: '',
                    page: {
                        path: 'orders',
                    },
                    page_from: page,
                },
            ]
        case 'buy':
            actionMessage(`Здравствуйте! По любым вопросам Вы можете связаться со мной в этом чате или по почте fomenko75@mail.ru. 
            Включите уведомления с моего сайта, чтобы всегда быть в курсе новостей.`)
            return [];
    }
}

async function actionMessage(text) {
    const admin = Object.values(store.getState().users.users).find(u => u.email === adminEmail);
    const user = store.getState().users.current;
    const {rooms} = store.getState().messenger;
    const adminRoom = Object.values(rooms).find(r => r.users.includes(adminEmail) && r.users.includes(user.email));
    if (!!Object.values(adminRoom.lastMessage).length) return;
    const config = {
        getDocument: () => adminRoom.messages,
    }
    const manager = new MessageManager('messenger', null, config);
    let msg = await manager.sendMessage({
        message: {
            text,
            upload: [],
        },
        user_id: admin.id,
    });
    updateRoom({lastMessage: msg, newMessage: true, notified:false}, adminRoom.id);
    setCurrentRoom(adminRoom.id);
    window.modals.open("messenger");
}