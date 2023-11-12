import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import store from 'store';

console.reportErrorsAsExceptions = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/serviceWorker.js`).then(
        registration => {
            console.log('Service worker registration succeeded:', registration);
        },
        error => {
            console.error(`Service worker registration failed: ${error}`);
        }
    )
} else {
    console.error('Service workers are not supported.');
}