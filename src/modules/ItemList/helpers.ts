//@ts-nocheck
import store from "../../store";

export let links = {};

export function createItemsTree(items) {
    console.log(links)
    if (!items.length) return items;
    // console.log('BEFORE TREE', items)

    let tree = {};
    let childItems = [];
    items.forEach(c => {
        if (c.parent) childItems.push({
            ...c, items:[],
        });
        else {
            tree[c.id] = {...c, items:[]};
            links[c.id] = tree[c.id];
        }
    })
    // console.log(childItems)
    childItems = childItems.sort((a, b) => +a.parent - +b.parent)
    childItems.forEach(c => {
        let p = links[c.parent];
        if (!p) return;
        p.items.push({...c, items: []});
        links[c.id] = p.items[p.items.length - 1];
    });
    console.log('AFTER TREE', tree);
    return (Object.values(tree));
}

export function childItemsTree(current) {
    const itemsAll = store.getState().elements.itemsAll;
    function traverseTree(current) {
        let items = [];
        for (const item in itemsAll) {
            if (itemsAll[item].parent === current.id) items.push(childItemsTree(itemsAll[item]));
        }
        return {...current, items};
    }
    return traverseTree(current);
}