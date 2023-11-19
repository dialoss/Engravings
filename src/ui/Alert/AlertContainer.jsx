import React, { useState} from 'react';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Alert from "./Alert";
import {ModalManager} from "../../components/ModalManager";
import TransformItem from "../ObjectTransform/components/TransformItem/TransformItem";
import {useAddEvent} from "../../hooks/useAddEvent";

const AlertContainer = () => {
    const [alerts, setAlerts] = useState([]);
    function triggerAlert(event) {
        const id = new Date().getTime();
        setAlerts(al => [...al, {...event.detail, id}]);
        setTimeout(() => {
            setAlerts(al => al.filter(a => a.id !== id));
        }, 2000);
    }
    useAddEvent('alert:trigger', triggerAlert);
    const modalName = "alert-window:toggle";
    return (
        <ModalManager name={modalName} defaultOpened={true} closeConditions={[]}>
            <div className={'alerts-container'} style={{bg: 'bg-none'}}>
                <TransitionGroup key={'alerts'} component={null}>
                    {
                        alerts.map((data) => <CSSTransition key={data.id} timeout={200} classNames={"alert"}>
                                <Alert data={data}></Alert>
                        </CSSTransition>
                        )
                    }
                </TransitionGroup>
            </div>
        </ModalManager>
    );
};

export default AlertContainer;