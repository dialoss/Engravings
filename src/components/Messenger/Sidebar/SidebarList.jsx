import React, {useContext} from 'react';
import Avatar from "../../../ui/Avatar/Avatar";
import dayjs from "dayjs";
import {useSelector} from "react-redux";

const SidebarList = ({list, className, currentItem, text, subtext=false, selectCallback, user}) => {
    const {users} = useSelector(state => state.messenger);
    return (
        <div className={"messenger-sidebar__list " + className}>
            {
                Object.values(list).map(item => {
                    const msg = item.lastMessage;
                    let userItem = users[item.companion || item.id];
                    if (!userItem) return;
                    const lastTime = userItem.lastSeen;
                    const online = userItem.online;
                    return <div className={"sidebar-item__wrapper " + (currentItem(item.id) ? "current " : '') +
                        (item.newMessage && item.lastMessage.user !== user.id ? "new" : '')}
                                onClick={() => selectCallback(item.id)}
                                key={item.id}>
                        <div className={"sidebar-item " + (online ? 'online' : 'offline')}>
                            <Avatar extraInfo={true} src={item.picture} user={userItem}>
                                <span className={"subtext"} style={{color:'#000'}}>{!online ? 'Был в сети ' +
                                    (lastTime?dayjs(lastTime).format("HH:mm DD.MM"):'') : 'Онлайн'}
                                </span>
                            </Avatar>
                            <span className="text-wrapper">
                            <span className={"text"}>
                                <span className={'wrapper'}>{item[text]}
                                </span>
                            </span>
                                {!subtext && <span className={"subtext subtext-lastseen"}>
                                        <span className={'wrapper'}>
                                            <span>{!online ? 'Был в сети ' +
                                                (lastTime?dayjs(lastTime).format("HH:mm DD.MM"):'') : 'Онлайн'}</span>
                                        </span>
                                </span>}
                                {subtext && msg && <span className={"text-block"}>
                                <span className={"subtext subtext-message"}>
                                    <span className={'wrapper'}>
                                        {
                                            !!msg.value && (!!msg.value.text ? msg.value.text : msg.value.upload.filename)
                                        }
                                    </span>
                                </span>

                                <span className={"subtext subtext-date"}>
                                    <span className={'wrapper'}>
                                        {dayjs(msg.timeSent).format("HH:mm")}
                                    </span>
                                </span>
                            </span>}
                        </span>
                        </div>
                    </div>
                })
            }
        </div>
    );
};

export default SidebarList;