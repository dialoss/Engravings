import React, {useEffect, useState} from 'react';

import {sendLocalRequest, sendRequest} from "api/requests";
import Sidebar from "./components/Sidebar/Sidebar";
import {actions} from "pages/AppRouter/store/reducers";
import {useDispatch, useSelector} from "react-redux";
import {NavbarRoutes} from "../Navbar/routes";
import {triggerEvent} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";

const SidebarContainer = () => {
    const [pages, setPages] = useState([]);
    const dispatch = useDispatch();

    async function fetchPages() {
        const response = await sendLocalRequest('/api/pages/', {}, 'GET', false);
        function spl(p) {
            return p.split('/').length;
        }
        response.sort((a, b) => {
            return spl(a.path) - spl(b.path);
        });
        let tree = {};
        // for (const page of NavbarRoutes) {
        //     const p = response.find(p => p.path === page.path.slice(1, -1));
        //     if (p) tree[p.slug] = p;
        // }
        console.log(response)
        for (const page of response) {
            let path = page.path.split('/');
            if (!path.length) continue;
            const empty = (depth) => ({
                link: '/' + page.path + '/',
                text: page.title || page.slug,
                id: page.id,
                sublist: [],
                depth,
            });
            if (!tree[path[0]]) tree[path[0]] = empty(0);
            for (const p of path) {
                if (!tree[p]) tree[path[0]].sublist.push(empty(1));
            }
        }
        console.log(tree)
        for (const t in tree) {
            tree[t].sublist.sort((a, b) => {
                if (a.text < b.text) return -1;
                if (a.text > b.text) return 1;
                return 0;
            });
        }
        setPages(Object.values(tree));
        dispatch(actions.setPages(response));
    }

    function createPage() {
        triggerEvent('user-prompt', {title: 'Информация о странице', button: 'ok', windowButton: true, data: {
                path: {
                    name: 'path',
                    type: "input",
                    attrs: ['required'],
                    label: "Путь",
                    value: ''
                },
                title: {
                    name: 'title',
                    type: 'input',
                    label: 'Название',
                    value: '',
                }
        }, submitCallback: async (fields) => {
            const data = {};
            for (const f in fields) {
                data[f] = fields[f].value;
            }
            data.slug = data.path.split('/').slice(-1)[0];
            await sendLocalRequest('/api/pages/', data, 'POST', false);
            fetchPages();
        }});
    }
    useAddEvent("sidebar:create-page", createPage);

    useEffect(() => {
        fetchPages();
    }, []);

    const userAdmin = useSelector(state => state.users.current).isAdmin;
    return (
        <Sidebar admin={userAdmin} customer={true}
                 data={{sublist:pages, depth:-1, createPage}}/>
    );
};

export default SidebarContainer;