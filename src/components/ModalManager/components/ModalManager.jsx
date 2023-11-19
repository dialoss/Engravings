import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Modal from "ui/Modal/Modal";
import {useAddEvent} from "hooks/useAddEvent";

let openedModals = [10];
let closed = false;

const ModalManager = ({name, children, callback=null, defaultOpened=false, closeConditions=['bg', 'btn', 'esc']}) => {
    const [isOpened, setOpened] = useState(defaultOpened);
    const openRef = useRef();
    openRef.current = isOpened;

    useLayoutEffect(() => {
        setOpened(defaultOpened);
    }, [defaultOpened]);

    function toggleModal(state) {
        if (state.detail.toggle) setOpened(opened => !opened);
        else setOpened(state.detail.isOpened);
    }

    function close() {
        if (closed) return;
        const current = +ref.current.style.zIndex;
        console.log(current, openedModals.slice(-1))
        if (current === openedModals.slice(-1)[0]){
            setOpened(false);
            closed = true;
            setTimeout(()=>{closed=false},50)
            openedModals.pop();
        }
    }

    function backgroundClick() {
        closeConditions.includes('bg') && openRef.current && close();
    }
    useAddEvent(name, toggleModal);
    useAddEvent(name + ':check-opened', (event) => event.detail(openRef.current));

    const ref = useRef();
    useEffect(() => {
        if (closeConditions.includes('btn')) ref.current.querySelectorAll(".window-close").forEach(button => {
            button.addEventListener("click", close);
        });
        if (closeConditions.includes('esc')) window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                close();
            }
        });
    }, [closeConditions]);

    useEffect(() => {
        callback && callback(isOpened);
        if (isOpened) {
            const prev = openedModals.slice(-1)[0];
            let t = prev + 1;
            openedModals.push(t)
            ref.current.style.zIndex = t;
            const item = ref.current.querySelector('.transform-item');
            item && (item.style.zIndex = t);
        }
    }, [isOpened]);
    const modal = <Modal content={children}
                         name={name}
                         isOpened={isOpened}
                         closeCallback={backgroundClick}
                         key={name}></Modal>;
    return (
        <div className={"modal-manager"} ref={ref} style={{position:'fixed'}}>
            {modal}
        </div>
    );
}

export default ModalManager;