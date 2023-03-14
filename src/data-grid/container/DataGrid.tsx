import * as React from "react";
import {Box, Paper, Table} from "@mui/material";
import {GridToolbar} from "../components/toolbar";
import {useState} from "react";
import {EnhancedTableHead} from "../components/Header";
import {
    Column,
    Order,
    Row,
} from "../TypeDeclaration";
import EnhancedBody from "../components/Body";
import {GridFooter} from "../components/Footer";
import MapVM from "../../ol-map/models/MapVM";


export const enhancedTableBodyRef = React.createRef<EnhancedBody>();

interface DataGridProps {
    columns: Column[];
    data: Row[];
    title: string
    tableHeight: number,
    tableWidth: number | 'auto'
    mapVM: MapVM
}

const DADataGrid = (props: DataGridProps) => {
    const [dense, setDense] = React.useState(true);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>('rowId');
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [rowCount, setRowCount] = useState<number>(0)

    React.useEffect(() => {
        setRowsPerPage(props.data.length)
    }, [props.data])
    // const dateColumns = props.columns.filter((c) => c.type === "date")
    const initData: Row[] = props.data.map((row, index) => {
        // console.log("row", row)
        // dateColumns.forEach((c)=> {
        //     row[c.id] = new Date(row[c.id])
        // })
        return Object.assign(row, {rowId: index + 1})
    });
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

    const paperWidth = props.tableWidth//for adjusting scrollbar for table
    const toolbarHeight = 30
    const tableHeight = props.tableHeight - toolbarHeight; //- 155;
    return (
        <React.Fragment>
            <Box sx={{width: '100%'}}>
                <GridToolbar numSelected={selected?.length || 0}
                             columns={props.columns}
                             tableName={props.title}
                             data={initData} height={toolbarHeight}
                             selectedRowIds={selected || []}
                             mapVM={props.mapVM}
                />
                <Box sx={{width: '100%', height: tableHeight, overflow: "auto"}}>
                    <Paper sx={{width: paperWidth, boxSizing: "border-box"}}>

                        <Table
                            stickyHeader={true}
                            sx={{width: '!00%'}}
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

                    </Paper>
                </Box>
                <GridFooter
                    dense={dense} page={page} rowCount={rowCount}
                    rowsPerPage={rowsPerPage}
                    handleChangeDense={handleChangeDense}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Box>
        </React.Fragment>
    );
}

export default DADataGrid;
