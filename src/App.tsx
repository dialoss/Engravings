//@ts-nocheck
import React, {useEffect} from "react";
import 'styles/App.scss';
import {TemplatePage} from "./pages/TemplatePage";
function App() {
    return (
        <div className="App">
            <TemplatePage></TemplatePage>
            {/*<CarouselModal></CarouselModal>*/}
            {/*<QuizContainer></QuizContainer>*/}
        </div>
    );
}

export default App;
