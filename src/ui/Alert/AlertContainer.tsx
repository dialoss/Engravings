import React, { useState} from 'react';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Alert from "./Alert";
import {ModalManager} from "../../components/ModalManager";
import {useAddEvent} from "../../hooks/useAddEvent";

const AlertContainer = () => {
    const [alerts, setAlerts] = useState([]);
    function triggerAlert(event) {
        const id = new Date().getTime();
        setAlerts(al => [...al, {...event.detail, id}]);
        setTimeout(() => {
            setAlerts(al => al.filter(a => a.id !== id));
        }, event.detail.timeout || 2000);
    }
    function closeAlert() {
        setAlerts([]);
    }
    function replaceAlert(id) {

    }
    useAddEvent("alert:replace", replaceAlert);
    useAddEvent("alert:close", closeAlert);
    useAddEvent('alert:trigger', triggerAlert);
    return (
        <ModalManager name={'alert'} defaultOpened={true} closeConditions={[]}>
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