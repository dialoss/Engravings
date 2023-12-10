//@ts-nocheck
import React, {useEffect} from 'react';
import './FormTextarea.scss';
import {isMobileDevice} from "../../../../helpers/events";

const FormTextarea = ({data}) => {
    const ref = React.createRef();
    function adjustHeight() {
        let el = ref.current;
        el.style.height = "1px";
        el.style.height = (2 + el.scrollHeight)+"px";
    }
    useEffect(() => {
        adjustHeight();
    }, [data]);
    return (
        <textarea ref={ref} className="form-textarea"
                  name={data.name} value={data.value}
                  rows={1}
                  onChange={(event) => {
                      data.callback(event);
                      adjustHeight();
                  }}>
        </textarea>
    );
};

export default FormTextarea;