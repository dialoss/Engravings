import store from "store";
import {getLocation} from "../../../hooks/getLocation";
import dayjs from "dayjs";
import {sendEmail} from "../../../api/requests";
import {MessageManager, setCurrentRoom, updateRoom, updateUser} from "../../../components/Messenger/api/firebase";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {adminEmail, firestore} from "../../../components/Messenger/api/config";
import {actions} from "../../../components/Messenger";
import {isMobileDevice, triggerEvent} from "../../../helpers/events";

export const ContextActions = {
    'add':{
        text: 'Добавить',
        argument: null,
        actions: {
            'quick': {
                callback: 'add',
                argument: true,
                text: 'Новая',
            },
            'empty': {
                callback: 'add',
                argument: true,
                text: 'Пустая',
            },
            'tabs': {
                callback: 'add',
                argument: true,
                text: 'Вкладки',
            },
            'intro': {
                callback: 'add',
                argument: true,
                text: 'Шапка',
            },
            'shop': {
                callback: 'add',
                argument: true,
                text: 'Продажа',
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
            'textfield': {
                callback: 'add',
                argument: true,
                text: 'Текстовое поле',
            },
            'price': {
                callback: 'add',
                argument: true,
                text: 'Цена',
            },

            'button': {
                callback: 'add',
                argument: true,
                text: 'Кнопка',
            },

            'table': {
                callback: 'add',
                argument: true,
                text: 'Таблица',
            },
        }
    },
    'storage': {
        text: 'Хранилище',
        argument: false,
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
            }
        case 'quick':
            return {
                type: 'base',
                show_date: true,
                description: 'Описание',
                title: 'Заголовок',
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
                text: 'кнопка'
            }
        case 'tabs':
            return {
                "type": "base",
                "movable": false,
                "group_order": "tabs",
                "show_date": false,
                "date_created": "2023-11-11T09:08:00.400088Z",
                "items": [
                    {
                        "type": "button",
                        "width": "35%",
                        "height": "52.75px",
                        "group_order": "tab",
                        "text": "текст",
                        "link": "$tab_0",
                    },
                    {
                        "type": "button",
                        "width": "35%",
                        "height": "52.75px",
                        "group_order": "tab",
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
                        container_width: '100px',
                        height: '100px',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'subscription',
                        width: "50%",
                        container_width: '100px',
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
                                text: 'Приобрести',
                                group_order: 1,
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
                group_order: 1,
            }
        case "timeline":
            return {
                show_shadow: false,
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
                        title: 'Обработка материала',
                        color: '#a97117',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Сборка',
                        color: '#a6ae09',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Тестирование',
                        color: '#74d50d',
                        show_shadow: false,
                        movable: false,
                    },
                    {
                        type: 'timeline_entry',
                        title: 'Упаковка',
                        color: '#0e6900',
                        show_shadow: false,
                        movable: false,
                    },
                ]
            }
        case 'timeline_entry':
            return {
                type: 'timeline_entry',
                title: 'Заголовок',
                show_shadow: false,
                movable: false,
            }
        case 'intro':
            return {
                "type": "base",
                container_width: '1100px',
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
                                        "width": "50%",
                                        container_width: '100px',
                                        "height": "100px",
                                        "top": "60px",
                                        "left": "0px",
                                        "position": "absolute",
                                        "movable": false,
                                        "show_shadow": false,
                                        group_order: 1,
                                    },
                                    {
                                        "type": "subscription",
                                        "width": "50%",
                                        "top": "50px",
                                        "left": "50%",
                                        "position": "absolute",
                                        "show_shadow": false,
                                        group_order: 2,
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
                                "url": "https://drive.google.com/uc?id=1TT6KWUcn4_4shc-DK--2JDR4W4_nUuPT",
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
                                "type": "price",
                                group_order: 1,
                                "text": "Заказать изготовление",
                                "link": "$order",
                                "price": "<p>от 160000</p>",
                            }
                        ]
                    }
                ]
            }
        case 'order':
            actionMessage(`Здравствуйте! Я принял Ваш заказ и в скором времени свяжусь с Вами,
                     чтобы обсудить детали заказа. По любым вопросам Вы можете связаться со мной в этом чате, в комментариях 
                     на странице заказа или по почте fomenko75@mail.ru. Включите уведомления с моего сайта, чтобы всегда быть 
                      в курсе новостей.`)

            const user = store.getState().users.current;
            const location = getLocation();
            const name = user.name.replaceAll(' ', '-');
            const orderName = location.pageSlug.toUpperCase();

            sendEmail({
                type: 'order',
                subject: 'MyMount | Новый заказ',
                data: {
                    user,
                    order: orderName,
                }
            });

            return [{
                unique: JSON.stringify({customer: user.name, order: orderName}),
                type: 'base',
                title: orderName,
                description: `Заказ ` + user.name,
                parent: '',
                page: {
                    slug: name,
                    path: 'orders/' + name,
                },
                items: [
                    {
                        show_shadow: false,
                        type: 'subscription',
                        title: 'Дата начала изготовления ',
                    },
                ]
            },
                {
                    unique: JSON.stringify({customer: user.name, order: orderName}),
                    type: 'base',
                    title: orderName,
                    description: `Заказ ` + user.name,
                    group_order: 'tab_1',
                    parent: '',
                    page: {
                        slug: 'orders',
                        path: 'orders',
                    },
                    page_from: {
                        slug: name,
                        path: 'orders/' + name,
                    },
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
            upload: {},
        },
        user_id: admin.id,
    });
    updateRoom({lastMessage: msg, newMessage: true, notified:false}, adminRoom.id);
    const messenger = document.querySelector('.messenger-window .transform-item');
    if (!isMobileDevice()) {
        messenger.style.right = '50px';
        messenger.style.bottom = '200px';
    }
    setCurrentRoom(adminRoom.id);
    triggerEvent("messenger-window:toggle", {isOpened: true});
}