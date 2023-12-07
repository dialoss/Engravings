import React, {useCallback} from 'react';
import "./Button.scss";
import ContextMenu from "../ContextMenu/ContextMenu";

const ContextButton = ({action, depth}) => {

    return (
        <div className={`context__item s${depth}`}>
            <button className="context__button modal__toggle-button" onClick={action.callback}>{action.text}</button>
            <div className={"context__hover"}>
                {!!action.actions.length &&
                    <ContextMenu depth={depth} parentHover={true} actions={action.actions}>
                    </ContextMenu>
                }
            </div>
        </div>
    );
};

export default ContextButton;