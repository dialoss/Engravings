
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

    return (Object.values(tree)).sort((a, b) => a.display_pos - b.display_pos);
    // console.log('AFTER TREE', sorted);
}
