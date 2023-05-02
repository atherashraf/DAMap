import {Divider, Paper, Stack} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TablePagination from "@mui/material/TablePagination";
import * as React from "react";

interface IProps {
    dense: boolean
    page: number
    rowCount: number
    rowsPerPage: number
    handleChangeDense: Function
    handleChangePage: Function
    handleChangeRowsPerPage: Function
}


export const GridFooter = (props: IProps) => {

    return (
        <Paper elevation={2} sx={{px: 1, m: 0}}>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem/>}
                spacing={2}
            >
                <FormControlLabel
                    control={<Switch checked={props.dense}
                                     onChange={(e) => props.handleChangeDense(e)}/>}
                    sx={{p: 0}}
                    label="Dense padding"
                />
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    // component="span"
                    count={props.rowCount}
                    rowsPerPage={props.rowsPerPage}
                    page={props.page}
                    showFirstButton={true}
                    showLastButton={true}
                    onPageChange={(e,newPage) => props.handleChangePage(e, newPage)}
                    onRowsPerPageChange={(e) => props.handleChangeRowsPerPage(e)}
                />
            </Stack>
        </Paper>
    );

}
