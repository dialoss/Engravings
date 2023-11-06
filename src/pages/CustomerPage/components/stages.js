
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
            stages.push(stage);
            traverse(it.items);
        });
    }
    traverse(data.items);
    return stages;
}