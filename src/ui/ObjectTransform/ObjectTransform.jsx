import {useAddEvent} from "hooks/useAddEvent";
import {setItemTransform} from "./transform";
import {initContainerDimensions} from "./helpers";
import {triggerEvent} from "../../helpers/events";

class ObjectTransform {
    prevItem = null;
    clickCount = 0;

    iterateItems(item, func) {
        let index = 0;
        while (item) {
            if (index === 0) {
                func(item, "focused");
            }
            item = item.parentElement.closest('.transform-item');
            if (!item) break;
            func(item, "focused-parent");
            index++;
        }
    }

    toggleSelection(item) {
        if (this.clickCount === 1) {
            // item = item.parentElement.closest('.transform-item');
        }
        this.iterateItems(this.prevItem, (it, cl) => it.classList.remove(cl));
        this.iterateItems(item, (it, cl) => it.classList.add(cl));
        this.prevItem = item;
        this.clickCount++;
    }

    initTransform(e) {
        const event = e.detail;
        const item = event.origin.closest(".transform-item");
        const type = event.type;
        const alreadyFocused = this.prevItem === item;
        this.toggleSelection(item);
        triggerEvent('action:init', event);
        if (event.button !== 0 || !alreadyFocused) return;

        alreadyFocused && setItemTransform(event, type, item, event.origin);
    }

    initContainer(event) {
        initContainerDimensions(event.detail);
    }
}

const ObjectTransformContainer = () => {
    const manager = new ObjectTransform();
    useAddEvent("container:init", e => manager.initContainer(e));
    useAddEvent("transform:init", e => manager.initTransform(e));
    return (
        <></>
    );
}

export default ObjectTransformContainer;