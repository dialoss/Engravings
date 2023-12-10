//@ts-nocheck
import React, {useLayoutEffect, useState} from "react";
import {auth, firestore, messaging} from "../components/Messenger/api/config";
import {useAppSelector} from "hooks/redux";
import {doc, onSnapshot} from "firebase/firestore";
import store from "store";
import {actions} from "modules/Authorization/store/user/reducers";
import {signInWithCustomToken} from "firebase/auth";

class User {
    static getFirebase() {
        onSnapshot(doc(firestore, 'apps', 'users'), q => {
            let newUsers = {};
            q.data().users.forEach(user => {
                if (!Object.values(user).length) return;
                newUsers[user.id] = user;
            });
            store.dispatch(actions.setUsers(newUsers));
        });
    }
}
User.getFirebase();

export const FirebaseContainer = () => {
    const user = useAppSelector(state => state.users.current);
    useLayoutEffect(() => {
        if (!user.authenticated) return;
        let token = user.firebase.token;
        signInWithCustomToken(auth, token).then(() =>
            store.dispatch(actions.setUser({id: user.firebase.id}))
        );
        }, [user.authenticated]);
    return (
        <>
        </>
    );
}