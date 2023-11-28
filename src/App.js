import React from "react";
import 'styles/App.scss';
import {TemplatePage} from "./pages/TemplatePage";
import CarouselContainer from "./components/Modals/Carousel/CarouselContainer";
function App() {
    return (
        <div className="App">
            {/*<div style={{aspectRatio: 1668/1199, width: 400}}></div>*/}
            {/*<iframe title="Цунэнобу и демон"  style={{width: '100%', height:'100%'}}*/}
            {/*        src="https://view.genial.ly/655e3807449eca0011e7eb30"*/}
            {/*        allowscriptaccess="always" allowFullScreen="true" scrolling="yes"*/}
            {/*        allownetworking="all"></iframe>*/}
            <TemplatePage></TemplatePage>
            {/*<CarouselContainer></CarouselContainer>*/}
        </div>
    );
}

export default App;
