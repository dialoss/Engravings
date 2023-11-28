import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Modal from "ui/Modal/Modal";
import {useAddEvent} from "hooks/useAddEvent";
import {isMobileDevice} from "../../../helpers/events";

class ModalStorage {
   current = 10;
   id = 1;
   opened = {[this.id]: this.current};
   overlays = [];
   max() {
       return Math.max.apply(null, Object.values(this.opened));
   }
   open() {
       this.current = this.max() + 1;
       this.id += 1;
       this.opened[this.id] = this.current;
   }
   close(id) {
       setTimeout(() => {
           delete this.opened[id];
           this.current = this.max();
       }, 0);
   }
   check(id) {
       const m = this.max();
       return m === this.opened[id];
   }
}
const storage = new ModalStorage();

function overlayBody(name, opened) {
    if (isMobileDevice() && name.match(/messenger|carousel|filemanager|element|login/)) {
        if (opened) {
            document.body.classList.add('overlayed');
            storage.overlays.push(name);
        }
        if (!opened) {
            storage.overlays.pop();
            !storage.overlays.length && document.body.classList.remove('overlayed');
        }
    }
}

const ModalManager = ({name, children, callback=null, defaultOpened=false, closeConditions=['bg', 'btn', 'esc']}) => {
    const [isOpened, setOpened] = useState(defaultOpened);
    const openRef = useRef();
    openRef.current = isOpened;

    useLayoutEffect(() => {
        setOpened(defaultOpened);
    }, [defaultOpened]);

    function toggleModal(state) {
        const isOpened = state.detail.toggle ? !openRef.current : state.detail.isOpened;
        if (!isOpened) close(false);
        else setOpened(true);
    }

    const storageID = useRef();
    function close(check=true) {
        if (openRef.current && (storage.check(storageID.current) || !check)) {
            storage.close(storageID.current);
            setOpened(false);
            overlayBody(name, false);
        }
    }

    function backgroundClick() {
        closeConditions.includes('bg') && openRef.current && close();
    }
    useAddEvent(name + ':toggle', toggleModal);
    useAddEvent(name + ':check-opened', (event) => event.detail(openRef.current));

    const ref = useRef();
    useEffect(() => {
        if (closeConditions.includes('btn')) {
            const closeButton = ref.current.querySelector(".window-close");
            closeButton && closeButton.addEventListener("click", () => close(false));
        }
        if (closeConditions.includes('esc')) window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                close();
            }
        });
    }, [closeConditions]);

    useEffect(() => {
        callback && callback(isOpened);
        if (isOpened) {
            storage.open();
            storageID.current = storage.id;
            let front = storage.current;
            ref.current.style.zIndex = front;
            const item = ref.current.querySelector('.transform-item');
            item && (item.style.zIndex = front);
            ref.current.querySelector('.modal__window').style.zIndex = front;
            overlayBody(name, true);
        }
    }, [isOpened]);

    return (
        <div className={"modal-manager"} ref={ref} style={{position:'fixed', pointerEvents:'none'}}>
            <Modal content={children}
                   name={name}
                   isOpened={isOpened}
                   closeCallback={backgroundClick}
                   key={name}></Modal>
        </div>
    );
}

export default ModalManager;