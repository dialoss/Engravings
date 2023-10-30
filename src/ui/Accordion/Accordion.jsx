import React from 'react';
import "./Accordion.scss";

import {ReactComponent as IconChevronDown} from "ui/Iconpack/icons/chevron-down.svg";
import ToggleButton from "ui/Buttons/ToggleButton/ToggleButton";

const Accordion = React.forwardRef(function ({toggle, header, isOpened, height, text, children}, ref) {
    const state = (isOpened ? "opened" : "closed");
    const style = (isOpened ? {height:height} : {height:0})

    return (
        <div className={"accordion"}>
            <div className={"accordion-header"} onClick={toggle}>
                {header ? header :
                    <div className={"accordion-header__wrapper"}>
                        {text}
                        <ToggleButton isOpened={isOpened}><IconChevronDown/></ToggleButton>
                    </div>
                }
            </div>
            <div className={"accordion-body " + state} style={style}>
                <div className={"accordion-body__container"} ref={ref}>
                    {children}
                </div>
            </div>
        </div>
    );
});

export default Accordion;