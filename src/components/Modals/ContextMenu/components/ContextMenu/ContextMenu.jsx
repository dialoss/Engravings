import React from 'react';
import ContextButton from "../Button/Button";
import './ContextMenu.scss';

const ContextMenu = ({actions, position, parent=true, depth=0}) => {
    return (
        <div className="context-menu">
            {
                actions.map((action, index) =>
                    <ContextButton depth={depth + 1} action={action} key={index}></ContextButton>
                )
            }
        </div>
    );
};

export default ContextMenu;