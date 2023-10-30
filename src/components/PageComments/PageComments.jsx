import React from 'react';
import {getLocation} from "hooks/getLocation";
import Comments from "./components/CommentsContainer";
import Container from "../../ui/Container/Container";

const PageComments = () => {
    const location = getLocation();
    return (
        <div className={"comments " + location.pageID}>
            <Container>
                <div className="comments__inner">
                    <Comments page={'gavno'}></Comments>
                </div>
            </Container>
        </div>
    );
};

export default PageComments;