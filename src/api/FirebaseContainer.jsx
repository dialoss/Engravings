import React, {useLayoutEffect, useState} from "react";
import {auth, firestore} from "../components/Messenger/api/config";
import {useSelector} from "react-redux";
import {doc, onSnapshot} from "firebase/firestore";
import store from "store";
import {actions} from "modules/Authorization/store/user/reducers";
import {signInWithCustomToken} from "firebase/auth";

export const FirebaseContainer = () => {
    const user = useSelector(state => state.users.current);

    useLayoutEffect(() => {
        if (!user.authenticated) return;
        let token = user.firebase.token;
        signInWithCustomToken(auth, token).then(r => {
            store.dispatch(actions.setUser({id: user.firebase.id}));
        });

        const unsubscribe = onSnapshot(doc(firestore, 'apps', 'users'), q => {
            let newUsers = {};
            q.data().users.forEach(user => {
                if (!Object.values(user).length) return;
                newUsers[user.id] = user;
            });
            store.dispatch(actions.setUsers(newUsers));
        });
        return () => unsubscribe;
    }, [user.authenticated]);
    return (
        <>
        </>
    );
}