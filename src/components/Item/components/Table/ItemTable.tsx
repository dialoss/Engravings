//@ts-nocheck
import React, {useEffect, useState} from 'react';
import "./ItemTable.scss";
import {fetchRequest} from "api/requests";
import * as XLSX from 'xlsx/xlsx.mjs';

const ItemTable = ({data}) => {
    const [table, setTable] = useState([]);

    useEffect(() => {
        if (!data.url) return;
        fetchRequest(data.url).then(res => res.arrayBuffer()).then(file => {
            let data = new Uint8Array(file);
            let arr = [];
            for (let i = 0; i < data.length; ++i) arr.push(String.fromCharCode(data[i]));
            let workbook = XLSX.read(arr.join(""), {type:"binary"});
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];
            let rows = new Set();
            let columns = new Set();
            for (const cell in sheet) {
                if (cell[0] === '!') continue;
                columns.add(cell[0]);
                rows.add(+cell[1]);
            }
            let table = [];
            for (const row of rows) {
                let tableRow = [];
                for (const col of columns) {
                    if (!sheet[col + row]) tableRow.push('');
                    else tableRow.push(sheet[col + row].v.trim());
                }
                table.push(tableRow);
            }
            setTable(table);
        });
    }, []);

    return (
        <table className="item__table">
            <tbody>
            {
                table.map((row, i) =>
                    <tr key={i}>
                        {
                            row.map((value, j) =>
                                <td key={i*100 + j}><p>{value}</p></td>
                            )
                        }
                    </tr>
                )
            }
            </tbody>
        </table>
    );
};

export default ItemTable;