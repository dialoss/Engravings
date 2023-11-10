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
    let stages = [];
    function traverse(items) {
        items.forEach(it => {
            if (it.type !== 'timeline_entry') return;
            let stage = {...it};
            if (!stage.color) {
                stage.style = 'secondary';
                stage.color = stages[stages.length - 1].color;
            }
            else stage.style = 'primary';
            stage.items = it.items.filter(i => i.type !== 'timeline_entry');
            // console.log(stage.items)
            if (!it.items.length && stage.style === 'primary') stage.style = 'disabled';
            stages.push(stage);
            traverse(it.items);
        });
    }
    traverse(data.items);
    return stages;
}