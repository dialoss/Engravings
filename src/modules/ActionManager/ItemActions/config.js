import store from "store";
import {getLocation} from "../../../hooks/getLocation";
import dayjs from "dayjs";
import {sendEmail} from "../../../api/requests";
import {MessageManager, updateRoom} from "../../../components/Messenger/api/firebase";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {adminEmail, firestore} from "../../../components/Messenger/api/config";
import {actions} from "../../../components/Messenger";

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
            'empty': {
                callback: 'add',
                argument: true,
                text: 'Пустая',
            },
            'textfield': {
                callback: 'add',
                argument: true,
                text: 'Текстовое поле',
            },
            'price': {
                callback: 'add',
                argument: true,
                text: 'Покупка',
            },
            'button': {
                callback: 'add',
                argument: true,
                text: 'Кнопка',
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
        case 'price':
            return {
                price: "999",
                button: 'Приобрести',
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
                type: 'base',
                container_width: '900px',
                items: [
                    {
                        show_shadow: false,
                        movable: false,
                        type: 'subscription',
                        left: '0',
                        container_width: '100px',
                        height: '100px',
                        top: '50px',
                        width: '50%',
                        position: 'absolute',
                        group_order: 1,
                    },
                    {
                        type: 'base',
                        left: '50%',
                        top: '50px',
                        width: '50%',
                        position: 'absolute',
                        group_order: 2,
                        zindex: 3,
                        items: [
                            {
                                text: '<h1>Заголовок</h1>',
                                type: 'textfield',
                                movable: false,
                                show_shadow: false,
                                height: '100px',
                                width: '100%',
                                zindex: 3,
                            },
                            {
                                type: 'textfield',
                                text: 'Описание',
                                height: '100px',
                                width: '100%',
                                show_shadow: false,
                                movable: false,
                            },
                        ]
                    },
                    {
                        type: 'price',
                        price: 999,
                        link: '$order',
                        button: "Заказать изготовление",
                        show_shadow: false,
                        group_order: 3,
                    }
                ]
            }
        case 'order':
            actionMessage(`Здравствуйте! Я принял ваш заказ и в скором времени свяжусь с Вами,
                     чтобы обсудить детали заказа. По любым вопросам Вы можете связаться со мной в этом чате, в комментариях 
                     на странице заказа или по почте fomenko75@mail.ru. Включите уведомления с моего сайта, чтобы всегда быть 
                      в курсе новостей.`)

            const user = store.getState().users.current;
            const location = getLocation();
            const name = user.name.replaceAll(' ', '-');
            const date = dayjs(new Date().getTime()).format("HH:mm DD.MM");
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
                        title: 'Дата начала изготовления ' + date,
                        group_order: 1,
                    },
                ]
            },
                {
                    type: 'base',
                    title: orderName,
                    description: `Заказ ` + user.name,
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
            actionMessage(`Здравствуйте! По любым вопросам Вы можете связаться со мной в этом чате, в комментариях 
                     на странице заказа или по почте fomenko75@mail.ru. Включите уведомления с моего сайта, чтобы всегда быть 
                      в курсе новостей.`)
            return [];
    }
}

async function actionMessage(text) {
    const admin = Object.values(store.getState().users.users).find(u => u.email === adminEmail);
    const user = store.getState().users.current;
    const {rooms} = store.getState().messenger;
    const adminRoom = Object.values(rooms).find(r => r.users.includes(adminEmail) && r.users.includes(user.email));

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
}