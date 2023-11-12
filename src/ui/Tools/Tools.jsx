import React, {useState} from "react";
import FormInput from "../../components/Modals/MyForm/Input/FormInput";

export const SearchContainer = ({placeholder, inputCallback=() => {}, data, setData, searchBy, ...props}) => {
    const [value, setValue] = useState('');

    function handleSearch(query) {
        let newData = [];
        data.forEach(item => {
            let val = item;
            for (const p of searchBy.split('.')) val = val[p];
            if (val && (val.toLowerCase().includes(query.toLowerCase()) || val.includes(query))) {
                newData.push(item);
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

export const SortContainer = ({data, setData, config}) => {
    const field = config.sortBy;

    function handleSort() {
        window.filemanager.fromSearch = true;

        // let test = JSON.parse(JSON.stringify(globalsearch));
        let a = data.sort((a,b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
        // console.log(a)
        setData(structuredClone(a));
    }
    return (
        <p className={config.name} onClick={handleSort}>{config.text}</p>
    );
}
