import * as React from "react";
import { Box, Paper, Table } from "@mui/material";
import { GridToolbar } from "../components/toolbar";
import { useState } from "react";
import { EnhancedTableHead } from "../components/Header";
import EnhancedBody from "../components/Body";
import { GridFooter } from "../components/Footer";
export const enhancedTableBodyRef = React.createRef();
const DADataGrid = (props) => {
    const [dense, setDense] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('rowId');
    const [selected, setSelected] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    React.useEffect(() => {
        setRowsPerPage(props.data.length);
    }, [props.data]);
    // const dateColumns = props.columns.filter((c) => c.type === "date")
    const initData = props.data.map((row, index) => {
        // console.log("row", row)
        // dateColumns.forEach((c)=> {
        //     row[c.id] = new Date(row[c.id])
        // })
        return Object.assign(row, { rowId: index + 1 });
    });
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = initData.map((n) => n.rowId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleRowClick = (event, row) => {
        const rowId = row["rowId"];
        const selectedIndex = selected.indexOf(rowId);
        let newSelected = [];
        // newSelected.concat(name)
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, rowId);
        }
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const paperWidth = props.tableWidth; //for adjusting scrollbar for table
    const toolbarHeight = 30;
    const tableHeight = props.tableHeight - toolbarHeight; //- 155;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { sx: { width: '100%' } },
            React.createElement(GridToolbar, { numSelected: (selected === null || selected === void 0 ? void 0 : selected.length) || 0, columns: props.columns, tableName: props.title, data: initData, height: toolbarHeight, selectedRowIds: selected || [] }),
            React.createElement(Box, { sx: { width: '100%', height: tableHeight, overflow: "auto" } },
                React.createElement(Paper, { sx: { width: paperWidth, boxSizing: "border-box" } },
                    React.createElement(Table, { stickyHeader: true, sx: { width: '!00%' }, size: dense ? 'small' : 'medium' },
                        React.createElement(EnhancedTableHead, { numSelected: (selected === null || selected === void 0 ? void 0 : selected.length) || 0, order: order || 'asc', orderBy: orderBy || 'title', onSelectAllClick: handleSelectAllClick, onRequestSort: handleRequestSort, rowCount: rowCount, columns: props.columns }),
                        React.createElement(EnhancedBody, { ref: enhancedTableBodyRef, initData: initData, rowsPerPage: rowsPerPage, order: order, orderBy: orderBy, page: page, columns: props.columns, dense: dense, selected: selected, setRowCount: setRowCount, handleRowClick: handleRowClick })))),
            React.createElement(GridFooter, { dense: dense, page: page, rowCount: rowCount, rowsPerPage: rowsPerPage, handleChangeDense: handleChangeDense, handleChangePage: handleChangePage, handleChangeRowsPerPage: handleChangeRowsPerPage }))));
};
export default DADataGrid;
