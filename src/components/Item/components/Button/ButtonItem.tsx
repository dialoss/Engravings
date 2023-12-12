//@ts-nocheck
import React, {useRef} from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ButtonItem.scss";
import {preventOnTransformClick} from "../../../../ui/ObjectTransform/helpers";
import NavButton from "../../../../ui/Buttons/NavButton/NavButton";
import {useAppSelector} from "../../../../hooks/redux";
import store from "../../../../store";
import {getLocation} from "../../../../hooks/getLocation";
import {sendEmail} from "../../../../api/requests";
import {adminEmail} from "../../../Messenger/api/config";
import {MessageManager, setCurrentRoom, updateRoom} from "../../../Messenger/api/firebase";
import {ActionData} from "../../../../modules/ActionManager/ItemActions/config";
import {IMessage, IUser} from "../../../Messenger/store/reducers";
import {actions} from "../../../../pages/AppRouter/store/reducers";

function buy() {
    actionMessage(`Здравствуйте! По любым вопросам Вы можете связаться со мной в этом чате или по почте fomenko75@mail.ru. 
            Включите уведомления с моего сайта, чтобы всегда быть в курсе новостей.`)
}

function order() {
    actionMessage(`Здравствуйте! Я принял Ваш заказ и в скором времени свяжусь с Вами,
                     чтобы обсудить детали заказа. По любым вопросам Вы можете связаться со мной в этом чате, в комментариях 
                     на странице заказа или по почте fomenko75@mail.ru. Включите уведомления с моего сайта, чтобы всегда быть 
                      в курсе новостей.`);

    const user: IUser = store.getState().users.current;
    const location = getLocation();
    const name = user.name.replaceAll(' ', '-');
    const orderName = location.pageSlug.toUpperCase();
    const unique = JSON.stringify({customer: user.name, order: orderName});
    const page = {
        path: 'orders/' + name.toLowerCase(),
    }

    setTimeout(() => {
        window.callbacks.call("user-prompt", {title:'Перейти на страницу заказа?', button: 'да', submitCallback: agree => {
                agree && window.callbacks.call("router:navigate", page.path);
            }})
    }, 1000);

    sendEmail({
        recipient: 'matthewwimsten@gmail.com',
        type: 'order',
        subject: 'MyMount | Новый заказ',
        data: {
            user,
            order: {
                name
            },
        }
    });

    window.actions.request('POST', [
        {
            type: 'page',
            ...page,
            style: {},
            data:{
                title: name,
            }
        },
        {
            unique,
            type: 'base',
            data: {
                title: orderName,
                description: `Заказ ` + user.name,
            },
            style: {},
            page,
            items: [
                {
                    style: {
                        boxShadow: 'none',
                    },
                    data:{
                        title: 'Дата начала изготовления ',
                    },
                    type: 'subscription',
                },
            ]
        },
        {
            ...ActionData['timeline'],
            page,
            unique,
            style: {},
        },
        {
            unique,
            type: 'base',
            data:{
                title: orderName,
                description: `Заказ ` + user.name,
            },
            style: {},
            tab: 1,
            page: {
                path: 'orders',
            },
            page_from: page,
        },
    ]);
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
            text,
            upload: [],
            user: admin.id,
    } as IMessage);
    updateRoom({lastMessage: msg, newMessage: true, notified:false}, adminRoom.id);
    setCurrentRoom(adminRoom.id);
    window.modals.open("messenger");
}

const ButtonItem = ({data}) => {
    const ref = useRef();
    function buttonCallback() {
        if (preventOnTransformClick(ref)) return;
        let action = data.link;
        if (!action) return;
        if (action.includes('tab')) {
            const t = +(action.split('_')[1]);
            store.dispatch(actions.setTab(t));
            return;
        }
        switch (action) {
            case "$buy":
                window.ym(95613565,'reachGoal','buy');
                buy();
                return;
            case "$order":
                window.ym(95613565,'reachGoal','order');
                order();
                return;
        }
        if (action.match(/^\/.*/)) {
            window.callbacks.call("router:navigate", action);
        } else {
            window.open(action, "_blank")
        }
    }
    const tab = useAppSelector(state => state.location.tab);
    const activeTab = data.link.includes('tab') && tab === +data.link.split('_')[1];
    return (
        <div className={"item__button"} ref={ref}>
            {data.style === 'action' && <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.text}
            </ActionButton>}
            {data.style === 'nav' && <NavButton data={{callback: buttonCallback, text:data.text}} style={activeTab ? 'current' : ''}>
            </NavButton>}
        </div>
    );
};

export default ButtonItem;