import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Modal from "ui/Modal/Modal";
import {useAddEvent} from "hooks/useAddEvent";
import {isMobileDevice} from "../../../helpers/events";

interface IModal {
    id: number;
    name: string;
    isOpened: boolean;
    zindex: number;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

abstract class IModals {
    private current: IModal;
    private top: number;
    private opened: {
        [key: number]: IModal
    };
    private all: {
        [key: string]: IModal
    }
    private overlays: string[];
    abstract open(name: string) : number;
    abstract close(name: string, checkOverlay: boolean);
    abstract toggle(name: string);
    abstract checkState(name: string) : boolean;
    abstract add(modal: IModal);
}

class Modals implements IModals {
    current = null;
   all = {};
   opened = {};
   overlays = [];
   max() {
       return Math.max.apply(null, Object.values(this.opened));
   }
   open(name: string) {
       this.top = this.max() + 1;
       this.opened[this.id] = this.current;
       this.overlayBody(true);
       this.all[name].setOpened(true);
       return this.top;
   }
   close(name: string, checkOverlay: boolean) {
       if (checkOverlay && this.top !== this.all[name].zindex) return;
       setTimeout(() => {
           this.overlayBody(false);
           delete this.opened[id];
           this.top = this.max();
           this.all[name].setOpened(false);
       }, 0);
   }
   checkState(name: string) {
       return this.all[name].isOpened;
   }
   overlayBody(opened) {
       if (isMobileDevice() && this.current.name.match(/messenger|carousel|filemanager|element|login/)) {
           if (opened) {
               document.body.classList.add('overlayed');
               this.overlays.push(name);
           }
           if (!opened) {
               this.overlays.pop();
               !this.overlays.length && document.body.classList.remove('overlayed');
           }
       }
   }
   add(modal: IModal) {
       this.all[modal.name] = modal;
   }
   toggle(name: string) {
       if (this.all[name].isOpened) this.close(name, false);
       else this.open(name);
   }
}

declare global {
    interface Window {
        modals: Modals;
    }
}

window.modals = new Modals();

export enum MODAL_CC {
    BG = 'background',
    BTN = 'button',
    ESC = 'escape',
}

interface ModalProps {
    name: string;
    children: React.ReactNode;
    callback?: () => void;
    closeConditions: MODAL_CC[];
    defaultOpened: boolean;
}

const ModalManager = ({name, children, callback=null, defaultOpened=false, closeConditions=['bg', 'btn', 'esc']} : ModalProps) => {
    const [isOpened, setOpened] = useState(defaultOpened);
    const openRef = useRef<boolean>(false);
    openRef.current = isOpened;

    useEffect(() => {
        window.modals.add(name);
    }, []);

    useLayoutEffect(() => {
        setOpened(defaultOpened);
    }, [defaultOpened]);

    function backgroundClick() {
        closeConditions.includes('bg') && openRef.current && window.modals.close(name, true);
    }

    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        if (closeConditions.includes('btn')) {
            const closeButton = ref.current.querySelector(".window-close");
            closeButton && closeButton.addEventListener("click", () => window.modals.close(name, false));
        }
        if (closeConditions.includes('esc')) window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.modals.close(name, true)
            }
        });
    }, [closeConditions]);

    useEffect(() => {
        callback && callback(isOpened);
        if (isOpened) {
            let front = window.modals.open(name);
            ref.current.style.zIndex = front;
            const item = ref.current.querySelector('.transform-item');
            item && (item.style.zIndex = front);
            ref.current.querySelector('.modal__window').style.zIndex = front;
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