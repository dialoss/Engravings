//@ts-nocheck
/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from 'react'
import {codegen, Editor, styled, Styles} from '@compai/css-gui'

export const CSSEditor = () => {
    const [styles, setStyles] = useState({
        fontSize: { value: 16, unit: 'px' },
        color: 'tomato',
        backgroundColor: '#000',
    })

    return (
        <>
            <Editor styles={styles} onChange={setStyles} />
            <styled.p styles={styles}>Hello, world!</styled.p>
            <pre>{codegen.css(styles)}</pre>
        </>
    )
}