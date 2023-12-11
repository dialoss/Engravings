//@ts-nocheck
import React from 'react';
import AccordionContainer from "../Accordion/AccordionContainer";

function createItemsTree(data, config: Config) {
    const parent = config.parentSelector;
    let items = data.sort((a, b) => a[parent] - b[parent]);

    let links = {};
    let tree = {};
    let childItems = [];
    items.forEach(c => {
        if (c[parent]) childItems.push({
            ...c, items:[],
        });
        else {
            tree[c.id] = {...c, items:[]};
            links[c.id] = tree[c.id];
        }
    })

    childItems = childItems.sort((a, b) => +a.parent - +b.parent)
    childItems.forEach(c => {
        let p = links[c[parent]];
        if (!p) return;
        p.items.push({...c, items: []});
        links[c.id] = p.items[p.items.length - 1];
    });
    return {...tree};
}

type Config = {
    accordion: boolean;
    childSelector: string;
    parentSelector: string;
    sortingFunction?: (...args: any[]) => any;
    recursiveComponent: React.FunctionComponent;
    componentDataProp: string;
}

const HierarchyItem = ({data, config, depth} : {data: any, config: Config, depth: number}) => {
    const item =  Object.values(data).map(it =>
        React.createElement(config.recursiveComponent, {
            [config.componentDataProp]: it,
        }, <HierarchyItem data={it[config.childSelector]} config={config} depth={depth + 1} key={it.id}>
        </HierarchyItem>));

    return (
        <>
            {config.accordion ? <AccordionContainer>
                <div className={"connector"}></div>
                {item}
            </AccordionContainer> : <>{item}</>}
        </>
    );
}

const Hierarchy = ({data, config} : {data: any, config: Config}) => {
    const tree = createItemsTree(data, config);

    return (
        <HierarchyItem data={tree} config={config} depth={0}>
        </HierarchyItem>
    )
};

export default Hierarchy;