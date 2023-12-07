import React, {useState} from "react";
import FormInput from "../../components/Modals/MyForm/Input/FormInput";

export const SearchContainer = ({placeholder, inputCallback=() => {}, data, setData, searchBy, ...props}) => {
    const [value, setValue] = useState('');

    function handleSearch(query) {
        const newData = data.filter(item => {
            let val = item;
            for (const p of searchBy.split('.')) val = val[p];
            if (val && (val.toLowerCase().includes(query.toLowerCase()) || val.includes(query))) {
                // item.visible = true;
                return true;
            } else {
                // item.visible = false;c
                return false;
            }
        })
        setData(newData);
    }

    return (
        <FormInput placeholder={placeholder}
                   data={{
                       name: 'search',
                       value,
                       callback: (e) => {
                           let query = e.target.value;
                           if (!query) setData(data);
                           else handleSearch(query);
                           inputCallback(query);
                           setValue(query);
                       },
                   }} {...props}></FormInput>
    );
}

function compare(a, b) {
    let t = Date.parse(a);
    if (t) {
        return t - Date.parse(b);
    }
    if (typeof(a) === 'string') {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
    return a - b;
}

export const SortContainer = ({data, setData, config}) => {
    const field = config.sortBy;
    const [order, setOrder] = useState(config.order);

    function handleSort() {
        window.filemanager.fromSearch = true;

        let sorted = data.sort((a, b) => order * (compare(a[field], b[field]))).map((f, i) => ({...f, hash: f.hash + i}));
        setData(sorted);
        setOrder(o => -o);
    }
    return (
        <div className={"wrapper wrapper-" + config.name} onClick={handleSort}>
            <p className={config.name}>{config.text}</p>
        </div>

    );
}
