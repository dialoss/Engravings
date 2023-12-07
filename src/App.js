import React, {useEffect} from "react";
import 'styles/App.scss';
import {TemplatePage} from "./pages/TemplatePage";
import CarouselContainer, {CarouselModal} from "./components/Modals/Carousel/CarouselContainer";
import QuizContainer from "./components/Item/components/Quiz/QuizContainer";
import {useAddEvent} from "./hooks/useAddEvent";
import {triggerEvent} from "./helpers/events";
import {uploadFile} from "./modules/FileExplorer";
import {GoogleAPI} from "./modules/FileExplorer/api/google";
function App() {
    const t = [
        {
            "filename": "IMG_20201003_142604.jpg",
            "uploading": false,
            "type": "image",
            "media_width": "4000",
            "url": "1w2yxyl2nP8Djzpk8FJzxD_xgFqAv4Y6y",
            "media_height": "3000"
        },
        {
            "uploading": false,
            "type": "image",
            "filename": "IMG_20201003_125116.jpg",
            "media_width": "3000",
            "url": "14X0_zYqUJATmVn2t858gs19RS8Nsyxv-",
            "media_height": "4000"
        },
        {
            "filename": "IMG_20201003_125113.jpg",
            "uploading": false,
            "type": "image",
            "media_height": "4000",
            "media_width": "3000",
            "url": "1DDmFA1RSKt6Ui4cM4AkB8UTR1LecNRGU"
        },
        {
            "url": "1E02WcNbVigtZZe6QUWcbwb02cQ3mVJtL",
            "media_width": "3000",
            "filename": "IMG_20201003_125110.jpg",
            "type": "image",
            "uploading": false,
            "media_height": "4000"
        }
    ]

    function upload(e) {
        const api = new GoogleAPI();
        api.uploadFile(e.target.files[0]);
    }
    return (
        <div className="App">
            <input type="file" onChange={upload}/>
            <button onClick={() => triggerEvent("carousel:open",{item: 1, items:t} )}>click</button>
            {/*<div style={{aspectRatio: 1668/1199, width: 400}}></div>*/}
            {/*<iframe title="Цунэнобу и демон"  style={{width: '100%', height:'100%'}}*/}
            {/*        src="https://view.genial.ly/655e3807449eca0011e7eb30"*/}
            {/*        allowscriptaccess="always" allowFullScreen="true" scrolling="yes"*/}
            {/*        allownetworking="all"></iframe>*/}
            {/*<TemplatePage></TemplatePage>*/}
            {/*<CarouselModal></CarouselModal>*/}
            {/*<QuizContainer></QuizContainer>*/}

        </div>
    );
}

export default App;
