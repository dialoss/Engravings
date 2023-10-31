export function createCommentsTree(comments, sorting) {
    let newComments = comments.sort(sorting).sort((a, b) => {
        if (a.parent < b.parent) return -1;
        if (a.parent > b.parent) return 1;
        return 0;
    });

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
            sorting = (a, b) => {
                if (d(a.timeSent) > d(b.timeSent)) return -1;
                if (d(a.timeSent) < d(b.timeSent)) return 1;
                return 0;
            }
            break;
        case "oldest":
            sorting = (a, b) => {
                if (d(a.timeSent) < d(b.timeSent)) return -1;
                if (d(a.timeSent) > d(b.timeSent)) return 1;
                return 0;
            }
            break;
    }
    return sorting;
}
