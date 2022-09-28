import getComparator, {stableSort} from "./utils";
import {Column, Filter, Order, Row, StyledTableCell, StyledTableRow} from "../TypeDeclaration";
import Checkbox from "@mui/material/Checkbox";
import {TableBody} from "@mui/material";
import * as React from "react";
import autoBind from "auto-bind";


interface EnhancedBodyProps {
    initData: Row[]
    page: number
    rowsPerPage: number
    columns: Column[],
    dense: boolean,
    order: Order,
    orderBy: string,
    selected: readonly number[],
    handleRowClick: Function,
    setRowCount: Function
}

interface EnhancedBodyState {
    data: Row[]
    // selected: number[]

}

class EnhancedBody extends React.PureComponent<EnhancedBodyProps, EnhancedBodyState> {
    constructor(props: EnhancedBodyProps) {
        super(props);
        autoBind(this);
        this.state = {
            data: props.initData
        }
    }

    setData(data: Row[]) {
        this.setState({data: data})
        this.props.setRowCount(data.length)
    }

    componentDidUpdate(prevProps: Readonly<EnhancedBodyProps>, prevState: Readonly<EnhancedBodyState>, snapshot?: any) {
        if (prevProps.initData.length != this.props.initData.length) {
            this.setData(this.props.initData)
        }
    }

    isRowSelected(rowId: any) {
        return this.props.selected.indexOf(rowId) !== -1
    }


    applyFilter(filters: Filter[]) {
        let data = this.props.initData;
        filters.forEach((filter: Filter) => {
            data = data.filter((r: Row) => {
                // const values = (typeof filter.value === 'string') ? filter.value.toString().split(',') : [filter.value]
                // @ts-ignore
                // return values.reduce((previous: any, current: any) => previous &&
                return Array.isArray(r[filter.key]) ? r[filter.key].findIndex((v: string) => v == filter.value) != -1 : r[filter.key] == filter.value
            })
        });
        this.setData(data);
        // olMapCtrl.clearSelectedFeatures();
        // data.forEach((r: Row) => {
        //     olMapCtrl.selectFeature(r.id);
        // })
        // olMapCtrl.zoomToSelectedFeatures();
    }

    clearFilter() {
        // olMapCtrl.clearSelectedFeatures();
        this.setData(this.props.initData)
    }


    render() {
        const {data} = this.state
        const {page, order, orderBy, rowsPerPage, dense} = this.props
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

        return (
            <TableBody>
                {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                        const isItemSelected = this.isRowSelected(row["rowId"]);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <StyledTableRow
                                hover
                                onClick={(event) =>
                                    this.props.handleRowClick(event, row)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.rowId}
                                selected={isItemSelected}
                            >
                                <StyledTableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </StyledTableCell>
                                {this.props.columns.map((info: Column) =>
                                    <StyledTableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                        align={info.type !== 'string' ? "center" : "left"}
                                    >
                                        {Array.isArray(row[info.id])? row[info.id].toString(): row[info.id]}
                                    </StyledTableCell>
                                )}

                            </StyledTableRow>
                        );
                    })}
                {emptyRows > 0 && (
                    <StyledTableRow
                        style={{height: (dense ? 33 : 53) * emptyRows}}
                    >
                        <StyledTableCell colSpan={6}/>
                    </StyledTableRow>
                )}
            </TableBody>
        )
    }
}

export default EnhancedBody
