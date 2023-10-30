import React, {useLayoutEffect, useRef, useState} from 'react';

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
                <p {...props}>{`${children}${'.'.repeat(count)}`}</p>
            </div>}
        </>

    );
};

export default TextLoader;