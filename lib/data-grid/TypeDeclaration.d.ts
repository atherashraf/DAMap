import * as React from "react";
export declare type Order = 'asc' | 'desc';
export interface Row {
    rowId: number;
    [key: string]: any;
}
export interface Column {
    disablePadding: boolean;
    id: string;
    label: string;
    type: "string" | "number" | "date";
}
export interface Filter {
    key: string;
    value: string | number[] | Date[];
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
    columns: Column[];
    selectedRowIds: readonly number[];
    height: number;
}
export interface FilterMenuProps {
    data: Row[];
    columns: Column[];
}
export declare const StyledTableCell: import("@emotion/styled").StyledComponent<import("@mui/material").TableCellProps & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
export declare const StyledTableRow: import("@emotion/styled").StyledComponent<{
    children?: React.ReactNode;
    classes?: Partial<import("@mui/material").TableRowClasses>;
    hover?: boolean;
    selected?: boolean;
    sx?: import("@mui/material").SxProps<import("@mui/material").Theme>;
} & import("@mui/material/OverridableComponent").CommonProps & Omit<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, "key" | keyof React.HTMLAttributes<HTMLTableRowElement>> & {
    ref?: React.Ref<HTMLTableRowElement>;
}, "children" | "selected" | "sx" | keyof import("@mui/material/OverridableComponent").CommonProps | "hover"> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, {}, {}>;
