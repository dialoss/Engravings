import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

const TextLoader = ({children, isLoading, dots=3, ...props}) => {
    const [count, setCount] = useState(1);
    const intervalRef = useRef();
    useLayoutEffect(() => {
        if (!isLoading) {
            clearInterval(intervalRef.current);
            setCount(1);
        } else {
            intervalRef.current = setInterval(() => {
                setCount(c => (c + 1) % (dots + 1));
            }, 500);
        }
    }, [isLoading]);

    return (
        <>
            {isLoading && <div className={"text-loader"}>
                <span {...props} data-count={'.'.repeat(count)}>{children}</span>
            </div>}
        </>

    );
};

export default TextLoader;