import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import useKeypress from "react-use-keypress";
import Modal from "ui/Modal/Modal";
import {useAddEvent} from "hooks/useAddEvent";
import TransformItem from "../../../ui/ObjectTransform/components/TransformItem/TransformItem";

const ModalManager = ({name, children, callback=null, defaultOpened=false, closeConditions=['bg', 'btn', 'esc']}) => {
    const [isOpened, setOpened] = useState(defaultOpened);
    const openRef = useRef();
    openRef.current = isOpened;
    useKeypress('Escape', (event) => {
        if (!closeConditions.includes('esc')) return;
        setOpened(false);
    });

    useLayoutEffect(() => {
        setOpened(defaultOpened);
    }, [defaultOpened]);

    function toggleModal(state) {
        if (state.detail.toggle) setOpened(opened => !opened);
        else setOpened(state.detail.isOpened);
    }

    function backgroundClick() {
        closeConditions.includes('bg') && openRef.current && setOpened(false);
    }
    useAddEvent(name, toggleModal);
    useAddEvent(name + ':check-opened', (event) => event.detail(openRef.current));

    const ref = useRef();
    useEffect(() => {
        if (closeConditions.includes('btn')) ref.current.querySelectorAll(".window-close").forEach(button => {
            button.addEventListener("click", () => {
                console.log('modal button')
                setOpened(false)
            });
        });
    }, [children]);

    useEffect(() => {
        if (callback)
            callback(isOpened);
    }, [isOpened]);

    const modal = <Modal contentInner={children}
                         name={name}
                         isOpened={isOpened}
                         closeCallback={backgroundClick}
                         key={name}></Modal>;

    return (
        <div className={"modal-manager"} ref={ref}>
            {modal}
        </div>
    );
}

export default ModalManager;