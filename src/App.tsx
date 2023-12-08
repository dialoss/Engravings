import React, {useEffect} from "react";
import 'styles/App.scss';
// import {TemplatePage} from "./pages/TemplatePage";
// import CarouselContainer, {CarouselModal} from "./components/Modals/Carousel/CarouselContainer";
// import QuizContainer from "./components/Item/components/Quiz/QuizContainer";
import {triggerEvent} from "./helpers/events";
import {AppStorage, storage} from "./modules/FileExplorer/api/storage";
import FileExplorer from "./modules/FileExplorer/FileExplorer";
import ContentWrapper from "./ui/ContentWrapper/ContentWrapper";
import {TemplatePage} from "./pages/TemplatePage";
import QuizContainer from "./components/Item/components/Quiz/QuizContainer";
import ItemListContainer from "./modules/ItemList/components/ItemListContainer";
import {AppRouter} from "./pages/AppRouter";
import {BrowserRouter} from "react-router-dom";
function App() {

    return (
        <div className="App">
            {/*<input type="file" onChange={upload}/>*/}
            {/*<button onClick={() => triggerEvent("carousel:open",{item: 1, items:t} )}>click</button>*/}
            {/*<FileExplorer></FileExplorer>*/}
            {/*<button onClick={() => triggerEvent("filemanager-window:toggle", {isOpened:true})}>click</button>*/}
            {/*<ContentWrapper></ContentWrapper>*/}
            {/*<div style={{aspectRatio: 1668/1199, width: 400}}></div>*/}
            {/*<iframe title="Цунэнобу и демон"  style={{width: '100%', height:'100%'}}*/}
            {/*        src="https://view.genial.ly/655e3807449eca0011e7eb30"*/}
            {/*        allowscriptaccess="always" allowFullScreen="true" scrolling="yes"*/}
            {/*        allownetworking="all"></iframe>*/}
            <TemplatePage></TemplatePage>
            {/*<CarouselModal></CarouselModal>*/}
            {/*<QuizContainer></QuizContainer>*/}
        </div>
    );
}

export default App;
