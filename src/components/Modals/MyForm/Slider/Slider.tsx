//@ts-nocheck
import React, {useContext, useLayoutEffect, useState} from 'react';
import "./Slider.scss";
import FormSelect from "../Select/FormSelect";

const Slider = ({data}) => {
    const [point, setPoint] = useState('px');
    useLayoutEffect(() => {
        if (data.value.match(/%/)) setPoint('%');
        else setPoint('px');
    }, [data.value]);

    let config = {
        min: 50,
        max: 1600,
        step: 50,
    }
    if (point === '%') {
        config = {
            min: 0,
            max: 100,
            step: 0.25,
        }
    }
    const val = +data.value.replace(point, '') || 0;
    return (
        <div className="form-slider">
            <FormSelect data={{
                options: {
                    "px": "Пиксели",
                    "%": "Проценты",
                },
                value: point,
                callback: (v) => setPoint(v.target.value)
            }}></FormSelect>
            <p>{val + point}</p>
            <input value={val}
                   name={data.name}
                   type={'range'}
                   {...config}
                    className={'form-input'}
                   onChange={(v) => data.callback({target:{value: v.target.value + point}})}/>
            <input value={val}
                   name={data.name}
                   type={'input'}
                   className={'form-input'}
                   onChange={(v) => data.callback({target:{value: v.target.value + point}})}/>
        </div>
    );
};

export default Slider;