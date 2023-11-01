import {createSlice} from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        // baseURL : 'https://matthew75.pythonanywhere.com',
        baseURL : 'http://localhost:8000',
        pages : {},
        pageID : '',
        fullURL : '',
        relativeURL : '',
        pageSlug : '',
        pageTitle: '',
        parentURL : '',
        parentSlug : '',
        views: {
            curViews: 0,
            totalViews: 0,
        }
    },
    reducers: {
        setLocation: (state) => {
            const url = decodeURI(window.location.href);
            state.relativeURL = url.split('/').slice(3).join('/');
            if (state.relativeURL[0] !== '/') state.relativeURL = '/' + state.relativeURL;
            if (state.relativeURL.slice(-1) !== '/') state.relativeURL = state.relativeURL + '/';
            state.fullURL = state.baseURL + state.relativeURL;
            state.pageSlug = state.relativeURL.split('/').slice(-2, -1)[0];
            state.parentURL = state.relativeURL.replace(state.pageSlug + '/', '');
            if (state.parentURL === '/') state.parentURL = state.relativeURL;
            state.parentSlug = state.parentURL.replaceAll('/', '');
            state.pageID = state.pages[state.relativeURL];
            state.pageTitle = state.pageSlug.toUpperCase();
        },
        setPages: (state, {payload: pages}) => {
            let pagesObj = {};
            pages.forEach(page => {
                pagesObj[page.link] = page.id;
            });
            state.pages = pagesObj;
            console.log(pagesObj)
        }
    }
});

export const { actions, reducer } = locationSlice;