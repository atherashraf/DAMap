import getComparator, { stableSort } from "./utils";
import { StyledTableCell, StyledTableRow } from "../TypeDeclaration";
import Checkbox from "@mui/material/Checkbox";
import { TableBody } from "@mui/material";
import * as React from "react";
import autoBind from "auto-bind";
class EnhancedBody extends React.PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            data: props.initData,
            isFilterApplied: false
        };
    }
    setData(data) {
        this.setState(() => ({ data: data }));
        this.props.setRowCount(data.length);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.initData.length !== this.props.initData.length) {
            this.setData(this.props.initData);
        }
    }
    isRowSelected(rowId) {
        return this.props.selected.indexOf(rowId) !== -1;
    }
    applyFilter(filters, selectionType) {
        let selectedData = [...this.props.initData];
        filters.forEach((filter) => {
            selectedData = selectedData.filter((r) => {
                if (typeof filter.value === 'string') {
                    return r[filter.key] === filter.value;
                }
                else if (Array.isArray(filter.value) && typeof filter.value[0] === 'number') {
                    return r[filter.key] >= filter.value[0] && r[filter.key] <= filter.value[1];
                }
                return null;
            });
        });
        switch (selectionType) {
            case "New":
                // await this.setData(selectedData);
                break;
            case "Add":
                if (this.state.isFilterApplied) {
                    selectedData = [...this.state.data, ...selectedData];
                }
                // await this.setData(selectedData);
                break;
            case "Remove":
                const selectedIds = selectedData.map((d) => d.rowId);
                selectedData = this.state.data.filter((d) => selectedIds.findIndex((id) => d.rowId === id) === -1);
                // await this.setData(selectedData)
                break;
            default:
                break;
        }
        this.setData(selectedData);
        this.setState(() => ({ isFilterApplied: true }));
        // olMapCtrl.clearSelectedFeatures();
        // setTimeout(() => {
        //     selectedData.forEach((r: Row) => {
        //         olMapCtrl.selectFeature(r.id);
        //     })
        //     olMapCtrl.zoomToSelectedFeatures();
        // }, 500)
    }
    clearFilter() {
        // olMapCtrl.clearSelectedFeatures();
        this.setData(this.props.initData);
        this.setState(() => ({ isFilterApplied: false }));
    }
    render() {
        const { data } = this.state;
        const { page, order, orderBy, rowsPerPage, dense } = this.props;
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
        return (React.createElement(TableBody, null,
            stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                const isItemSelected = this.isRowSelected(row["rowId"]);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (React.createElement(StyledTableRow, { hover: true, onClick: (event) => this.props.handleRowClick(event, row), role: "checkbox", "aria-checked": isItemSelected, tabIndex: -1, key: row.rowId, selected: isItemSelected },
                    React.createElement(StyledTableCell, { padding: "checkbox" },
                        React.createElement(Checkbox, { color: "primary", checked: isItemSelected, inputProps: {
                                'aria-labelledby': labelId,
                            } })),
                    this.props.columns.map((info) => React.createElement(StyledTableCell, { component: "th", id: labelId, scope: "row", padding: "none", align: info.type !== 'string' ? "center" : "left" }, Array.isArray(row[info.id]) ? row[info.id].toString() : row[info.id]))));
            }),
            emptyRows > 0 && (React.createElement(StyledTableRow, { style: { height: (dense ? 33 : 53) * emptyRows } },
                React.createElement(StyledTableCell, { colSpan: 6 })))));
    }
}
export default EnhancedBody;
