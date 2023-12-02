import {useAddEvent} from "hooks/useAddEvent";
import {changeItemPosition, getTransformData, setItemTransform, transformItem} from "./transform";
import {initContainerDimensions} from "./helpers";
import {triggerEvent} from "../../helpers/events";

class ObjectTransform {
    prevItem = null;
    clickCount = 0;

    iterateItems(item, func) {
        let index = 0;
        let it = item;
        while (it) {
            if (index === 0) {
                func(it, "focused");
            }
            it = it.closest('.item');
            if (!it) break;
            it = it.closest('.transform-item');
            if (!it) break;
            func(it, "focused-parent");
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
        if (event.event.button !== 0 || !alreadyFocused) return;
        if (alreadyFocused) setItemTransform(event.event, type, item, event.origin, {
            onSwipeEnd: (d) => {
                if (d.item.getAttribute('data-type') === 'modal') return;
                getTransformData(d);
            },
            onSwipeStart: transformItem,
        });
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