//@ts-nocheck
import React, {useEffect} from 'react';
import "./Print.scss";
import Button from "../../../../ui/Button/Button";
import ImageViewer from "../../../../ui/ImageViewer/ImageViewer";

const Print = ({data}) => {
    useEffect(() => {
        (function
        (d) {var js, id = "genially-embed-js", ref = d.getElementsByClassName("genially-embed-"+data.id)[0]; if (d.getElementById(id)) {return;} js = d.createElement("script"); js.id = id; js.async = true; js.src = "https://view.genial.ly/static/embed/embed.js"; ref.parentNode.insertBefore(js, ref);}(document));
    }, [])
    return (
        <div className={"item__print"}>
            <div className="container-wrapper-genially">
                <div id={data.genial} className={"genially-embed genially-embed-" + data.id}></div>
            </div>
            <Button>Раскрыть на весь экран</Button>
            <ImageViewer></ImageViewer>
        </div>
    );
};

export default Print;