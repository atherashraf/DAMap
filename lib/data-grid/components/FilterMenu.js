import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import { Autocomplete, FormGroup, IconButton, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
// import CommonUtils from "../../../base/utils/CommonUtils";
import { enhancedTableBodyRef } from "../container/DataGrid";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import RangeSlider from "./RangeSlider";
export default function FilterMenu(props) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [placement] = React.useState('left');
    const [filters, setFilter] = React.useState([{ key: "", value: "" }]);
    const [selectionType, setSelectionType] = React.useState('New');
    const selectionTypes = [["New", "New Selection"],
        ["Add", "Add To Selection"],
        ["Remove", "Remove From Selection"]];
    const handleSelectionType = (event) => {
        setSelectionType(event.target.value);
    };
    const clearFilter = () => {
        setFilter([{ key: "", value: "" }]);
    };
    const handleClick = (event) => {
        clearFilter();
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };
    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;
    // const cols = props.columns.filter((col) => col.type === "string");
    const getUniqueValues = (arr, key) => {
        const values = arr.map((r) => r[key].toString().split(",")[0]);
        // @ts-ignore
        return [...new Set(values)];
    };
    const getMinMaxValue = (arr, key) => {
        const values = arr.map((r) => r[key].toString().split(",")[0]);
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        };
    };
    const colValues = {};
    props.columns.forEach((col) => {
        switch (col.type) {
            case "string":
                colValues[col.id] = { type: col.type, values: getUniqueValues(props.data, col.id) };
                break;
            case "number":
                colValues[col.id] = { type: col.type, values: getMinMaxValue(props.data, col.id) };
                break;
            case "date":
                colValues[col.id] = { type: col.type, values: getMinMaxValue(props.data, col.id) };
                break;
            default:
                break;
        }
    });
    const getFilterSelector = (filter, index) => {
        var _a, _b, _c, _d, _e;
        return (React.createElement(FormGroup, { row: true },
            React.createElement(Autocomplete, { sx: { width: 120, mr: 2 }, options: props.columns, getOptionLabel: (c) => c.label, 
                // id={"filter_by_"+index}
                // value={cols.find((c:Column)=> c.id==filters[index].key)}
                disableClearable: true, onChange: (e, val) => {
                    // @ts-ignore
                    filter.key = val ? val.id : "";
                    filter.value = "";
                    setFilter(filters.map((value, i) => i == index ? filter : value));
                }, renderInput: (params) => (React.createElement(TextField, Object.assign({ sx: { m: 1 } }, params, { label: "Filter By", variant: "standard" }))) }),
            filter.key == "" || colValues[filter.key].type == "string" ?
                React.createElement(Autocomplete
                // id="free-solo-demo"
                , { 
                    // id="free-solo-demo"
                    sx: { width: 200 }, 
                    // defaultValue={filters[index].value}
                    options: (_a = colValues[filter.key]) === null || _a === void 0 ? void 0 : _a.values, 
                    // getOptionLabel={(r: Row) => r[filter.key]}
                    value: ((_c = (_b = filters[index]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.toString()) || "", disabled: filter.key == "", freeSolo: true, onChange: (e, val) => {
                        // @ts-ignore
                        filter.value = val ? val : "";
                        setFilter(filters.map((value, i) => i == index ? filter : value));
                    }, renderInput: (params) => React.createElement(TextField, Object.assign({ sx: { m: 1 } }, params, { label: "Filter Value", variant: "standard" })) }) : React.createElement(FormControl, { sx: { width: 200, ml: 2, mt: 5 } },
                React.createElement(RangeSlider, { min: (_d = colValues[filter.key]) === null || _d === void 0 ? void 0 : _d.values.min, max: (_e = colValues[filter.key]) === null || _e === void 0 ? void 0 : _e.values.max, handleValueChange: (value) => {
                        filter.value = value.map((v) => parseInt(v));
                        setFilter(filters.map((value, i) => i == index ? filter : value));
                    } }))));
    };
    const applyFilter = () => {
        var _a;
        if (filters.length > 0 && filters[0].key !== "" && filters[0].value !== "") {
            (_a = enhancedTableBodyRef.current) === null || _a === void 0 ? void 0 : _a.applyFilter(filters, selectionType);
            // setOpen((previousOpen) => !previousOpen);
            // CommonUtils.showSnackbar("Applying Filter");
        }
        else {
            // CommonUtils.showSnackbar("Please select filter values before applying");
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Clear Filter" },
            React.createElement(IconButton, { onClick: () => { var _a; return (_a = enhancedTableBodyRef.current) === null || _a === void 0 ? void 0 : _a.clearFilter(); } },
                React.createElement(FilterListOffIcon, null))),
        React.createElement(Tooltip, { title: "Filter" },
            React.createElement(IconButton, { onClick: handleClick },
                React.createElement(FilterListIcon, null))),
        React.createElement(Popper, { id: id, style: { zIndex: 100 }, open: open, anchorEl: anchorEl, placement: placement, transition: true }, ({ TransitionProps }) => (React.createElement(Fade, Object.assign({}, TransitionProps, { timeout: 350 }),
            React.createElement(Box, { sx: { border: 1, px: 3, bgcolor: 'background.paper' } },
                React.createElement(FormControl, { variant: "standard", sx: { mx: 1, mt: 2 }, fullWidth: true },
                    React.createElement(Select, { value: selectionType, onChange: handleSelectionType }, selectionTypes.map((t) => React.createElement(MenuItem, { value: t[0] }, t[1])))),
                filters.map((f, index) => getFilterSelector(f, index)),
                React.createElement("div", { style: {
                        width: "100%", paddingTop: 10, paddingBottom: 10,
                        display: "flex", alignItems: "center", justifyContent: "center"
                    } },
                    React.createElement(Button, { onClick: applyFilter }, "Apply Filter"),
                    React.createElement(Button, { onClick: () => {
                            // clearFilter();
                            setOpen((previousOpen) => !previousOpen);
                            // enhancedTableBodyRef.current?.clearFilter();
                        } }, "Close"))))))));
}
