import {createSlice} from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        // baseURL: 'http://localhost:8000',
        baseURL : 'https://matthew75.pythonanywhere.com',
        pages : {},
        fullURL : '',
        relativeURL : '',
        pageSlug : '',
        pageTitle: '',
        parentURL : '',
        parentSlug : '',
        currentPage: {},
        views: {
            curViews: 0,
            totalViews: 0,
        },
    },
    reducers: {
        setLocation: (state) => {
            let url = decodeURI(window.location.href);
            url = url.split('?')[0];
            state.relativeURL = url.split('/').slice(3).join('/');
            if (state.relativeURL[0] !== '/') state.relativeURL = '/' + state.relativeURL;
            if (state.relativeURL.slice(-1) !== '/') state.relativeURL = state.relativeURL + '/';
            state.fullURL = url;
            state.pageSlug = state.relativeURL.split('/').slice(-2, -1)[0];
            state.parentURL = state.relativeURL.replace(state.pageSlug + '/', '');
            state.parentSlug = state.parentURL.replaceAll('/', '');
            state.pageTitle = state.pageSlug.toUpperCase();
            for (const p in state.pages) {
                if ('/' + state.pages[p].path + '/' === state.relativeURL) {
                    state.currentPage = state.pages[p];
                    state.currentPage.title = state.currentPage.title || state.pageTitle;
                    break;
                }
            }
        },
        setPages: (state, {payload: pages}) => {
            let pagesObj = {};
            pages.forEach(page => {
                pagesObj[page.id] = page;
            });
            state.pages = pagesObj;
        }
    }
});

export const { actions, reducer } = locationSlice;