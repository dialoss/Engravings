import React from "react";
import 'styles/App.scss';
import Sidebar from "./components/Sidebar/components/Sidebar/Sidebar";
import {ActionManager} from "./modules/ActionManager/components";
import {TemplatePage} from "./pages/TemplatePage";

function App() {
    return (
        <div className="App">
            <TemplatePage></TemplatePage>
            {/*<Sidebar picker={false} customer={false} data={{sublist:[], depth:-1}}/>*/}
            {/*<ActionManager></ActionManager>*/}
        </div>
    );
}

export default App;
