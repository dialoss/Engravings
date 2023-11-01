export function createCommentsTree(comments, sorting) {
    let newComments = comments.sort(sorting).sort((a, b) => a.parent - b.parent);

    let tree = {};
    let links = {};
    newComments.forEach(c => {
        if (!!c.parent) {
            let p = links[c.parent];
            p.comments[c.id] = {
                comment: c,
                comments: {},
            }
            links[c.id] = p.comments[c.id];
        } else {
            tree[c.id] = {
                comment: c,
                comments: {},
            };
            links[c.id] = tree[c.id];
        }
    });
    console.log(newComments)
    return tree;
}

export function sortFunction(type) {
    let sorting = () => {};
    const d = (ds) => new Date(ds).getTime();
    switch (type) {
        case "newest":
            sorting = (a, b) => d(b.timeSent) - d(a.timeSent);
            break;
        case "oldest":
            sorting = (a, b) => d(a.timeSent) - d(b.timeSent);
            break;
    }
    return sorting;
}
