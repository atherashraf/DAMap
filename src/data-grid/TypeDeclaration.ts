import * as React from "react";
import {styled, TableCell, tableCellClasses, TableRow} from "@mui/material";

export type Order = 'asc' | 'desc';

export interface Row {
    // rowId?: number
    [key: string]: any
}
export interface Column {
    disablePadding: boolean;
    id: string;
    label: string;
    // isNumeric: boolean;
    type?: "string" | "number" | "date"
}
export interface Filter{
    key:string
    value: string | number | Date
}
export interface DataGridProps {
    columns: Column[];
    data: Row[];
    title: string
    tableHeight: number,
    tableWidth: number
}
export interface EnhancedTableHeadProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string | null;
    rowCount: number;
    columns: Column[];
}

export interface EnhancedTableToolbarProps {
    numSelected: number;
    tableName: string;
    data: Row[];
    columns: Column[]
    selectedRowIds: readonly number[];
}

export interface FilterMenuProps{
    data: Row[];
    columns: Column[]
}


export const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,

    },
}));

export const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
