import { Divider, Paper, Stack } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TablePagination from "@mui/material/TablePagination";
import * as React from "react";
export const GridFooter = (props) => {
    return (React.createElement(Paper, { elevation: 2, sx: { px: 1, m: 0 } },
        React.createElement(Stack, { direction: "row", divider: React.createElement(Divider, { orientation: "vertical", flexItem: true }), spacing: 2 },
            React.createElement(FormControlLabel, { control: React.createElement(Switch, { checked: props.dense, onChange: (e) => props.handleChangeDense(e) }), sx: { p: 0 }, label: "Dense padding" }),
            React.createElement(TablePagination, { rowsPerPageOptions: [5, 10, 25, 50, 100], 
                // component="span"
                count: props.rowCount, rowsPerPage: props.rowsPerPage, page: props.page, showFirstButton: true, showLastButton: true, onPageChange: (e, newPage) => props.handleChangePage(e, newPage), onRowsPerPageChange: (e) => props.handleChangeRowsPerPage(e) }))));
};
