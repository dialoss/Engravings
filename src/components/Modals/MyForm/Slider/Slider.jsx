import React, {useContext} from 'react';
import "./Slider.scss";
import {FormContext} from "../../../../modules/ActionForm/FormContainer";
import FormSelect from "../Select/FormSelect";

const Slider = ({data}) => {
    const {setFormFields} = useContext(FormContext);

    let config = {
        min: 0,
        max: 100,
        step: 0.25,
    }
    if (data.point === 'px') {
        config = {
            min: 50,
            max: 1600,
            step: 50,
        }
    }
    const val = +data.value.replace(data.point, '') || 0;
    return (
        <div className="form-slider">
            <FormSelect data={{
                options: {
                    "px": "Пиксели",
                    "%": "Проценты",
                },
                callback: (v) => setFormFields(f => ({...f, [data.name]: {...data, point: v.target.value}}))
            }}></FormSelect>
            <p>{val + data.point}</p>
            <input value={val}
                   name={data.name}
                   type={'range'}
                   {...config}
                    className={'form-input'}
                   onChange={data.callback}/>
            <input value={val}
                   name={data.name}
                   type={'input'}
                   className={'form-input'}
                   onChange={data.callback}/>
        </div>
    );
};

export default Slider;