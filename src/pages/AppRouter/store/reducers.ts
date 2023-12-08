import {createSlice} from "@reduxjs/toolkit";

interface IPage {
    title: string;
    path: string;
    views: number;
    slug: string;
    comments: boolean;
}

interface ILocation {
    serverURL: string,
    fullURL: string;
    relativeURL: string;
    pages: {key: number, value: IPage};
    currentPage: IPage;
}

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        // serverURL: 'http://localhost:8000',
        serverURL : 'https://matthew75.pythonanywhere.com',
        pages : {},
        fullURL : '',
        relativeURL : '',
        currentPage: {},
    } as ILocation,
    reducers: {
        setLocation: (state : ILocation) => {
            let url = decodeURI(window.location.href);
            url = url.split('?')[0];
            state.relativeURL = url.split('/').slice(3).join('/');
            if (state.relativeURL[0] !== '/') state.relativeURL = '/' + state.relativeURL;
            if (state.relativeURL.slice(-1) !== '/') state.relativeURL = state.relativeURL + '/';
            state.fullURL = url;
            for (const p in state.pages) {
                if ('/' + state.pages[p].path + '/' === state.relativeURL) {
                    state.currentPage = state.pages[p];
                    break;
                }
            }
        },
        setPages: (state: ILocation, {payload: pages}) => {
            let pagesObj = {};
            pages.forEach(page => {
                pagesObj[page.id] = page;
            });
            state.pages = pagesObj;
        }
    }
});

export const { actions, reducer } = locationSlice;