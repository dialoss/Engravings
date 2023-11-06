
export const routes = [
    {path:'/main/',         comments: false, component: 'Main',         style: "parent.module.scss",   exact:true},
    {path:'/models/',       comments: false, component: 'ItemsPage',   style: "parent.module.scss",   exact:true},
    {path:'/orders/',       comments: false, component: 'ItemsPage',   style: "parent.module.scss",   exact:true},
    {path:'/parts/',        comments: false, component: 'ItemsPage',   style: "parent.module.scss",   exact:true},
    {path:'/blueprints/',   comments: true, component: 'ItemsPage',    style: "blueprints.module.scss",   exact:true},
    {path:'/shop/',         comments: false, component: 'ItemsPage',   style: "shop.module.scss",  exact:true},
    {path:'/customer/',    comments: false, component: 'ItemsPage',    style: "child.module.scss",      exact:true},
    {path:'/models/:id',    comments: true, component: 'ItemsPage',    style: "child.module.scss",   exact:true},
    {path:'/orders/:id',    comments: true, component: 'ItemsPage',    style: "child.module.scss",      exact:true},
];
