//@ts-nocheck
import React, {useState} from 'react';
import PageComments from "../../components/PageComments/PageComments";
import ActionManager from "../../modules/ActionManager/components/ActionManager";
import {Footer} from "../../modules/Footer";
import NavbarContainer from "../../components/Navbar/NavbarContainer";

const StaticContent = () => {
    const [page, setPage] = useState();

    return (
        <>
            {/*<PageComments page={page}/>*/}
            <ActionManager></ActionManager>
        </>
    );
};

export default StaticContent;