import React, {useLayoutEffect, useRef, useState} from 'react';
import {getLocation} from "hooks/getLocation";
import Comments from "./components/CommentsContainer";
import Container from "../../ui/Container/Container";
import {useAppSelector} from "hooks/redux";

let counter = 0;
const PageComments = ({page}) => {
    const location = useAppSelector(state => state.location);
    const docRef = useRef();
    const [document, setDocument] = useState(null);
    const pageURL = location.relativeURL.slice(1, -1).replaceAll('/', '$');
    let t = 1;
    if (docRef.current && docRef.current !== pageURL && counter === 0) {
        setDocument(null);
        counter += 1;
        t = null;
    } else {
        counter = 0;
    }
    return (
        <div className={"comments"} id={'comments'} style={{marginTop:50, display: (page.comments ? "block" : "none")}}>
            <Container>
                <div className="comments__inner">
                    <Comments page={page.comments && pageURL}
                            document={t && page.comments && document} setDocument={(v) => {docRef.current = pageURL; setDocument(v)}}
                    ></Comments>
                </div>
            </Container>
        </div>
    );
};

export default PageComments;