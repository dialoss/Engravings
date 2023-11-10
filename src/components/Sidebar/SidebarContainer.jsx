import React, {useEffect, useState} from 'react';

import {sendLocalRequest} from "api/requests";
import Sidebar from "./components/Sidebar/Sidebar";
import {actions} from "pages/AppRouter/store/reducers";
import {useDispatch, useSelector} from "react-redux";

const SidebarContainer = () => {
    const [pages, setPages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const response = await sendLocalRequest('/api/static/navigation/');
            setPages(response.pages_tree);
            dispatch(actions.setPages(response.pages_list));
        })();
    }, []);

    const userAdmin = useSelector(state => state.users.current).isAdmin;
    // console.log(pages)
    return (
        <Sidebar authorized={userAdmin} customer={true}
                 data={{sublist:pages, depth:-1}}/>
    );
};

export default SidebarContainer;