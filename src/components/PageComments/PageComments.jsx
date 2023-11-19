import React, {useLayoutEffect, useRef, useState} from 'react';
import {getLocation} from "hooks/getLocation";
import Comments from "./components/CommentsContainer";
import Container from "../../ui/Container/Container";
import {useSelector} from "react-redux";
let counter = 0;
const PageComments = () => {
    const visible = useSelector(state => state.location.pageComments);
    const location = useSelector(state => state.location);
    const docRef = useRef();
    const [document, setDocument] = useState(null);
    const page = location.relativeURL.slice(1, -1).replaceAll('/', '$');
    let t = 1;
    if (docRef.current && docRef.current !== page && counter === 0) {
        setDocument(null);
        counter += 1;
        t = null;
    } else {
        counter = 0;
    }
    return (
        <div className={"comments"} id={'comments'} style={{marginTop:50, display: (visible ? "block" : "none")}}>
            <Container>
                <div className="comments__inner">
                    <Comments page={visible && page}
                            document={t && visible && document} setDocument={(v) => {docRef.current = page; setDocument(v)}}
                    ></Comments>
                </div>
            </Container>
        </div>
    );
};

export default PageComments;