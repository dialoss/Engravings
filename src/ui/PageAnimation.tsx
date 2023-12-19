//@ts-nocheck
import React from 'react';
import {motion} from "framer-motion";

const anim = {
    initial: {opacity: 0.5},
    animate: {opacity: 1},
    exit: {opacity: 0.5},
}

const PageAnimation = ({children}) => {
    return (
        <motion.div
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
            transition={{duration: 0.4}}
            variants={anim}>
            {children}
        </motion.div>
    );
};

export default PageAnimation;