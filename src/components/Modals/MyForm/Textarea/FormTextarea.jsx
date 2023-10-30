import React, {useEffect} from 'react';
import './FormTextarea.scss';

const FormTextarea = ({data}) => {
    const ref = React.createRef();
    function adjustHeight() {
        let el = ref.current;
        el.style.height = "1px";
        el.style.height = (25+el.scrollHeight)+"px";
    }
    useEffect(() => {
        adjustHeight();
    }, [data]);
    return (
        <textarea ref={ref} className="form-textarea"
                  name={data.name} value={data.value}
                  onChange={(event) => {
                      data.callback(event);
                      adjustHeight();
                  }}>
        </textarea>
    );
};

export default FormTextarea;