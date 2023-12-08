import React, {useLayoutEffect, useState} from "react";
import {auth, firestore, messaging} from "../components/Messenger/api/config";
import {useSelector} from "react-redux";
import {doc, onSnapshot} from "firebase/firestore";
import store from "store";
import {actions} from "modules/Authorization/store/user/reducers";
import {signInWithCustomToken} from "firebase/auth";
import {useAppSelector} from "../hooks/redux";

export const FirebaseContainer = () => {
    const user = useAppSelector(state => state.users.current);

    useLayoutEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, 'apps', 'users'), q => {
            let newUsers = {};
            q.data().users.forEach(user => {
                if (!Object.values(user).length) return;
                newUsers[user.id] = user;
            });
            RootState.dispatch(actions.setUsers(newUsers));
        });

        if (!user.authenticated) return;
        let token = user.firebase.token;
        signInWithCustomToken(auth, token).then(r => {
            store.dispatch(actions.setUser({id: user.firebase.id}));
        });

        return () => unsubscribe;
    }, [user.authenticated]);
    return (
        <>
        </>
    );
}