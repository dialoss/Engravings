//@ts-nocheck
export function itemsFromStages(data) {
    let _items = [];
    function traverse(items) {
        items.forEach(it => {
            it.type !== 'timeline_entry' && _items.push(it);
            traverse(it.items);
        });
    }
    traverse(data.items);
    return _items;
}

export function prepareStages(data) {
    function traverse(item) {
        let stages = [];
        item.items.forEach(it => {
            if (it.type !== 'timeline_entry') {
                stages.push({...it, color: item.color, style: 'secondary'});
                return;
            }
            let stage = {...it};
            if (!stage.color) {
                stage.style = 'secondary';
                stage.color = item.color;
            }
            else stage.style = 'primary';
            stage.colorPrev = !!stages.length && stages[stages.length - 1].color;

            if (!it.items.length && stage.style === 'primary') {
                stage.color = '#989898';
                stage.style += ' disabled';
            }
            stages.push(stage);
            it.items = traverse(it);
        });
        return stages;
    }
    return traverse(data);
}