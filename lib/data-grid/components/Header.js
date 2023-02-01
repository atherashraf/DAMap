import * as React from "react";
import { Box, Checkbox, TableHead, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import { StyledTableCell, StyledTableRow } from "../TypeDeclaration";
export const EnhancedTableHead = (props) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (React.createElement(TableHead, null,
        React.createElement(StyledTableRow, null,
            React.createElement(StyledTableCell, { padding: "checkbox" },
                React.createElement(Checkbox, { color: "primary", indeterminate: numSelected > 0 && numSelected < rowCount, checked: rowCount > 0 && numSelected === rowCount, onChange: onSelectAllClick, inputProps: {
                        'aria-label': 'select all desserts',
                    } })),
            props.columns.map((col) => (React.createElement(StyledTableCell, { key: col.id, align: col.type !== "string" ? 'center' : 'left', padding: col.disablePadding ? 'none' : 'normal', sortDirection: orderBy === col.id ? order : false },
                React.createElement(TableSortLabel, { active: orderBy === col.id, direction: orderBy === col.id ? order : 'asc', onClick: createSortHandler(col.id) },
                    col.label,
                    orderBy === col.id ? (React.createElement(Box, { component: "span", sx: visuallyHidden }, order === 'desc' ? 'sorted descending' : 'sorted ascending')) : null)))))));
};
