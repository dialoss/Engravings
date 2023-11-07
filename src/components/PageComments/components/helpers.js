export function createCommentsTree(comments, sorting, search) {
    let newComments = comments.sort(sorting).sort((a, b) => a.parent - b.parent);
    search = search.sort(sorting).sort((a, b) => a.parent - b.parent);
    let tree = {};
    let links = {};
    let searchPos = 0;
    //console.log('search', search)
    newComments.forEach(c => {
        if (!search[searchPos]) return;
        let searched = c.id === search[searchPos].id;
        if (searched) searchPos++;

        const comment = {
            searched,
            comment: c,
            comments: {},
        };

        if (!!c.parent) {
            let p = links[c.parent];
            p.comments[c.id] = comment;
            links[c.id] = p.comments[c.id];
            if (searched) p.searched = true;
        } else {
            tree[c.id] = comment;
            links[c.id] = tree[c.id];
        }
    });
    function siftTree(tree) {
        for (const comm in tree) {
            if (!tree[comm].searched) {
                delete tree[comm];
            } else {
                siftTree(tree[comm].comments);
            }
        }
    }
    siftTree(tree);
    //console.log(tree)
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
        case "default":
            sorting = (a, b) => {
                if (!a.parent && !b.parent) return d(b.timeSent) - d(a.timeSent);
                if (a.parent && !b.parent) return -1;
                if (!a.parent && b.parent) return 1;
                if (a.parent && b.parent) return d(a.timeSent) - d(b.timeSent);
            }
            break;
    }
    return sorting;
}
