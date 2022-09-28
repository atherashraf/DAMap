import * as React from "react";
import {Box, Paper, Table, TableBody, TableContainer} from "@mui/material";
import {EnhancedTableToolbar} from "../components/toolbar";
import {useState} from "react";
import {EnhancedTableHead} from "../components/Header";
import {
    DataGridProps,
    Order,
    Row,
} from "../TypeDeclaration";
import TablePagination from "@mui/material/TablePagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import EnhancedBody from "../components/Body";

export const enhancedTableBodyRef = React.createRef<EnhancedBody>();
const DADataGrid = (props: DataGridProps) => {


    const [dense, setDense] = React.useState(false);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const initData: Row[] = props.data.map((row, index) => ({rowId: index + 1, ...row}))
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>('title');
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [rowCount, setRowCount] = useState<number>(0)
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string,) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = initData.map((n) => n.rowId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleRowClick = (event: React.MouseEvent<unknown>, row: Row) => {
        const rowId = row["rowId"]
        const selectedIndex = selected.indexOf(rowId);
        let newSelected: readonly number[] = [];
        // newSelected.concat(name)
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, rowId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;
    // const isSelected = (rowId: any) => selected.indexOf(rowId) !== -1;

    const paperWidth = props.tableWidth//for adjusting scrollbar for table
    const tableHeight = props.tableHeight - 195;

    return (
        <React.Fragment>
            <Box sx={{width: '100%'}}>
                <Paper elevation={2}>

                    <EnhancedTableToolbar numSelected={selected?.length || 0}
                                          columns={props.columns}
                                          tableName={props.title}
                                          data={initData}
                                          selectedRowIds={selected || []}/>
                </Paper>
                <Box sx={{width: '100%', height: tableHeight, overflow: "auto"}}>
                    <Paper sx={{width: paperWidth, boxSizing: "border-box"}}>
                        <TableContainer>
                            <Table
                                stickyHeader
                                sx={{width: '!00%'}}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected?.length || 0}
                                    order={order || 'asc'}
                                    orderBy={orderBy || 'title'}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rowCount}
                                    columns={props.columns}
                                />
                                <EnhancedBody
                                    ref={enhancedTableBodyRef}
                                    initData={initData}
                                    rowsPerPage={rowsPerPage}
                                    order={order}
                                    orderBy={orderBy}
                                    page={page}
                                    columns={props.columns}
                                    dense={dense}
                                    selected={selected}
                                    setRowCount={setRowCount}
                                    handleRowClick={handleRowClick}
                                />
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
                <Paper elevation={2} sx={{paddingLeft: 2, paddingRight: 2, margin: 0}}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={rowCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense}/>}
                        sx={{padding: 0}}
                        label="Dense padding"
                    />
                </Paper>
            </Box>
        </React.Fragment>
    );
}

export default DADataGrid;
