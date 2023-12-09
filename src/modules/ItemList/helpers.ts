import store from "../../store";

export function createItemsTree(items) {
    if (!items.length || items[0].empty) return items;
    // console.log('BEFORE TREE', items)

    let tree = {};
    let links = {};
    let childItems = [];
    items.forEach(c => {
        childItems = [...childItems, ...c.items];
        tree[c.id] = {...c, items: []};
        links[c.id] = tree[c.id];
    })
    childItems = childItems.sort((a, b) => +a.parent - +b.parent)
    // console.log('BEFORE TREE CHILD', childItems)
    childItems.forEach(c => {
        let p = links[c.parent];
        p.items.push({...c, items: []});
        links[c.id] = p.items[p.items.length - 1];
    });

    return (Object.values(tree)).sort((a, b) => a.order - b.order);
    // console.log('AFTER TREE', sorted);
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