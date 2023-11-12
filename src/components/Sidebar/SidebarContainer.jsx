import React, {useEffect, useState} from 'react';

import {sendLocalRequest, sendRequest} from "api/requests";
import Sidebar from "./components/Sidebar/Sidebar";
import {actions} from "pages/AppRouter/store/reducers";
import {useDispatch, useSelector} from "react-redux";
import {NavbarRoutes} from "../Navbar/routes";

const SidebarContainer = () => {
    const [pages, setPages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const response = await sendLocalRequest('/api/pages/', {}, 'GET', false);
            function spl(p) {
                return p.split('/').length;
            }
            response.sort((a, b) => {
                return spl(a.path) - spl(b.path);
            });
            let tree = {};
            for (const page of NavbarRoutes) {
                const p = response.find(p => p.path === page.path.slice(1, -1));
                if (p) tree[p.slug] = p;
            }
            for (const page of response) {
                let path = page.path.split('/');
                if (!path.length) continue;
                if (!tree[path[0]]) continue;
                const empty = (depth) => ({
                    link: '/' + page.path + '/',
                    text: page.title || page.slug,
                    id: page.id,
                    sublist: [],
                    depth,
                });
                if (path.length === 1) tree[path[0]] = empty(0);
                for (const p of path) {
                    if (!tree[p]) tree[path[0]].sublist.push(empty(1));
                }
            }
            for (const t in tree) {
                tree[t].sublist.sort((a, b) => {
                    if (a.text < b.text) return -1;
                    if (a.text > b.text) return 1;
                    return 0;
                });
            }
            setPages(Object.values(tree));
            dispatch(actions.setPages(response));
        })();
    }, []);

    const userAdmin = useSelector(state => state.users.current).isAdmin;
    return (
        <Sidebar admin={userAdmin} customer={true}
                 data={{sublist:pages, depth:-1}}/>
    );
};

export default SidebarContainer;