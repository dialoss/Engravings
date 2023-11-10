
export const routes = [
    {path:'/main/',         comments: false, component: 'Main',     },
    {path:'/models/',       comments: false, component: 'ItemsPage',},
    {path:'/orders/',       comments: false, component: 'ItemsPage',},
    {path:'/parts/',        comments: false, component: 'ItemsPage',},
    {path:'/blueprints/',   comments: true, component: 'ItemsPage', },
    {path:'/shop/',         comments: false, component: 'ItemsPage',},
    {path:'/customer/',    comments: false, component: 'ItemsPage', },
    {path:'/models/:id',    comments: true, component: 'ItemsPage', },
    {path:'/orders/:id',    comments: true, component: 'ItemsPage', },
    // {path:'/:id/?',    comments: true, component: 'ItemsPage', },
];
