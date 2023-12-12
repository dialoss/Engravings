//@ts-nocheck
import React, {useLayoutEffect, useRef, useState} from "react";
import FormInput from "../../components/Modals/MyForm/Input/FormInput";

export const SearchContainer = ({placeholder, inputCallback=() => {}, data, setData, searchBy, ...props}) => {
    const [value, setValue] = useState('');
    const [setModifying, initialData] = useMemorize(data);

    function handleSearch(query) {
        const newData = initialData.current.filter(item => {
            let val = item;
            for (const p of searchBy.split('.')) val = val[p];
            return !!(val && (val.toLowerCase().includes(query.toLowerCase()) || val.includes(query)));
        })
        setModifying(true);
        setData(newData);
    }

    return (
        <FormInput placeholder={placeholder}
                   data={{
                       name: 'search',
                       value,
                       callback: (e) => {
                           let query = e.target.value;
                           if (!query) setData(initialData.current);
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

const useMemorize = (data) => {
    const initialData = useRef<any[]>([]);
    const [modifying, setModifying] = useState(false);
    const updatesCount = useRef<number>(0);

    useLayoutEffect(() => {
        if (modifying) {
            setModifying(false);
            return;
        }
        updatesCount.current += 1;
        if (!initialData.current) initialData.current = [...data];
        if (updatesCount.current === 2) {
            initialData.current = [...data];
            updatesCount.current = 1;
        }
    }, [data]);
    return [setModifying, initialData];
}

export const SortContainer = ({data, setData, config}) => {
    const field = config.sortBy;
    const [order, setOrder] = useState(config.order);
    const [setModifying, initialData] = useMemorize(data);

    function handleSort() {
        let sorted = initialData.current
            .sort((a, b) => order * (compare(a[field], b[field]))).map((f, i) => ({...f, hash: f.hash + i}));
        setModifying(true);
        setData(sorted);
        setOrder(o => -o);
    }
    return (
        <div className={"wrapper wrapper-" + config.name} onClick={handleSort}>
            <p className={config.name}>{config.text}</p>
        </div>
    );
}
