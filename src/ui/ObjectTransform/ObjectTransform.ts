import {getTransformData, setItemTransform, transformItem} from "./transform";
import {initContainerDimensions} from "./helpers";
import {actions} from "../../modules/ItemList/store/reducers";
import store from "../../store";

export interface IActionElement {
    [key: string]: number | string | object
}

export interface IElementActions {
    clickCount: number;
    focused: IActionElement;
    selected: IActionElement[];

    init(event, origin: HTMLElement, type: "move" | "resize");
}

export class ElementActions implements IElementActions{
    clickCount = 0;
    focused = {data: {}, id:-1, html:''};
    selected = [];

    iterateItems(item, func, style) {
        let index = 0;
        let it = item;
        while (it) {
            if (index === 0) {
                func(it, style);
            }
            it = it.closest('.item');
            if (!it) break;
            it = it.closest('.transform-item');
            if (!it) break;
            func(it, style + "-parent");
            index++;
        }
    }

    selectItems(item, event) {
        if (!item) return;
        if (this.clickCount === 1) {
            // item = item.parentElement.closest('.transform-item');
        }
        let style = "focused";
        if (event.ctrlKey) {
            style = "selected";
            let alreadySelected = false;
            for (const it of this.selected) {
                if (it.id === this.focused.id) alreadySelected = true;
            }
            if (alreadySelected) this.selected = this.selected.filter(it => it.id !== this.focused.id);
            else this.selected.push(this.focused);
        }

        this.iterateItems(this.focused.html, (it, cl) => it.classList.remove(cl), style);
        this.iterateItems(item, (it, cl) => it.classList.add(cl), style);
        this.clickCount++;
        this.focused = store.getState().elements.itemsAll[+item.getAttribute('data-id')];
        this.focused.html = item;

        store.dispatch(actions.setField({field: "focused", payload: {...this.focused, html: ''}}));
        console.log(this.focused, this.selected)
    }

    init(event, origin: HTMLElement, type: "move" | "resize") {
        const item = origin.closest(".transform-item");
        let alreadyFocused;
        if (item.getAttribute('data-type') !== 'modal') {
            alreadyFocused = this.focused.id === +item.getAttribute('data-id');
            this.selectItems(item, event);
        } else {
            alreadyFocused = true;
        }
        if (alreadyFocused) setItemTransform(event, type, item, origin, {
            onSwipeEnd: (d) => {
                if (d.item.getAttribute('data-type') === 'modal') return;
                getTransformData(d);
            },
            onSwipeStart: transformItem,
        });
    }

    initContainer(data) {
        initContainerDimensions(data);
    }
}