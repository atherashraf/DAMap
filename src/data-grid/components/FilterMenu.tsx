import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import {
    Autocomplete,
    FormGroup,
    IconButton,
    MenuItem,
    PopperPlacementType,
    Select, SelectChangeEvent,
    TextField,
    Tooltip
} from "@mui/material";
import {Column, Filter, FilterMenuProps, Row} from "../TypeDeclaration";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
// import CommonUtils from "../../../base/utils/CommonUtils";
import {enhancedTableBodyRef} from "../container/DataGrid";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import RangeSlider from "./RangeSlider";

export default function FilterMenu(props: FilterMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [placement] = React.useState<PopperPlacementType>('left');
    const [filters, setFilter] = React.useState<Filter[]>([{key: "", value: ""}])
    const [selectionType, setSelectionType] = React.useState('New');
    const selectionTypes = [["New", "New Selection"],
        ["Add", "Add To Selection"],
        ["Remove", "Remove From Selection"]]
    const handleSelectionType = (event: SelectChangeEvent) => {
        setSelectionType(event.target.value);
    };
    const clearFilter = () => {
        setFilter([{key: "", value: ""}]);
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        clearFilter();
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;
    // const cols = props.columns.filter((col) => col.type === "string");

    const getUniqueValues = (arr: Row[], key: string) => {
        const values = arr.map((r: Row) => r[key].toString().split(",")[0])
        // @ts-ignore
        return [...new Set(values)]
    }
    const getMinMaxValue = (arr: Row[], key: string) => {
        const values = arr.map((r: Row) => r[key].toString().split(",")[0])
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        }
    }
    const colValues: any = {}
    props.columns.forEach((col: Column) => {
        switch (col.type) {
            case "string":
                colValues[col.id] = {type: col.type, values: getUniqueValues(props.data, col.id)}
                break;
            case "number":
                colValues[col.id] = {type: col.type, values: getMinMaxValue(props.data, col.id)}
                break;
            case "date":
                colValues[col.id] = {type: col.type, values: getMinMaxValue(props.data, col.id)}
                break;
            default:
                break;
        }
    })
    const getFilterSelector = (filter: Filter, index: number) => {
        return (
            <FormGroup row>
                {/*<FormControl variant="standard" sx={{width: 60}}>*/}
                {/*    {index > 0 ?*/}
                {/*        <Select*/}
                {/*            sx={{mr: 1, mt: 3, width: 60}}*/}
                {/*            label="Op"*/}
                {/*            defaultValue={"And"}*/}
                {/*        >*/}
                {/*            <MenuItem value={"And"}>And</MenuItem>*/}
                {/*            <MenuItem value={"Or"}>Or</MenuItem>*/}
                {/*        </Select> : <React.Fragment></React.Fragment>}*/}
                {/*</FormControl>*/}
                <Autocomplete
                    sx={{width: 120, mr: 2}}
                    options={props.columns}
                    getOptionLabel={(c: Column) => c.label}
                    // id={"filter_by_"+index}
                    // value={cols.find((c:Column)=> c.id==filters[index].key)}
                    disableClearable
                    onChange={(e, val) => {
                        // @ts-ignore
                        filter.key = val ? val.id : ""
                        filter.value = ""
                        setFilter(filters.map((value, i) => i == index ? filter : value))
                    }}
                    renderInput={(params) => (
                        <TextField sx={{m: 1}} {...params}
                                   label="Filter By" variant="standard"/>
                    )}
                />
                {filter.key == "" || colValues[filter.key].type == "string" ?
                    <Autocomplete
                        // id="free-solo-demo"
                        sx={{width: 200}}
                        // defaultValue={filters[index].value}
                        options={colValues[filter.key]?.values}
                        // getOptionLabel={(r: Row) => r[filter.key]}
                        value={filters[index]?.value?.toString() || ""}
                        disabled={filter.key == ""}
                        freeSolo
                        onChange={(e, val) => {
                            // @ts-ignore
                            filter.value = val ? val : ""
                            setFilter(filters.map((value, i) => i == index ? filter : value))

                        }}
                        renderInput={(params) =>
                            <TextField sx={{m: 1}} {...params}
                                       label="Filter Value" variant="standard"
                            />}
                    /> : <FormControl sx={{width: 200, ml: 2, mt: 5}}>
                        <RangeSlider
                            min={colValues[filter.key]?.values.min}
                            max={colValues[filter.key]?.values.max}
                            handleValueChange={(value: string[]) => {
                                filter.value = value.map((v) => parseInt(v))
                                setFilter(filters.map((value, i) => i == index ? filter : value))

                            }}
                        /></FormControl>}
            </FormGroup>
        )
    }
    const applyFilter = () => {
        if (filters.length > 0 && filters[0].key !== "" && filters[0].value !== "") {
            enhancedTableBodyRef.current?.applyFilter(filters, selectionType)
            // setOpen((previousOpen) => !previousOpen);
            // CommonUtils.showSnackbar("Applying Filter");
        } else {
            // CommonUtils.showSnackbar("Please select filter values before applying");
        }
    }
    return (
        <React.Fragment>
            <Tooltip title={"Clear Filter"}>
                <IconButton onClick={() => enhancedTableBodyRef.current?.clearFilter()}>
                    <FilterListOffIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title={"Filter"}>
                <IconButton onClick={handleClick}>
                    <FilterListIcon/>
                </IconButton>
            </Tooltip>
            <Popper id={id} style={{zIndex: 100}} open={open} anchorEl={anchorEl} placement={placement} transition>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box sx={{border: 1, px: 3, bgcolor: 'background.paper'}}>
                            <FormControl variant="standard" sx={{mx: 1, mt: 2}} fullWidth={true}>
                                <Select value={selectionType}
                                        onChange={handleSelectionType}
                                >
                                    {selectionTypes.map((t) => <MenuItem value={t[0]}>{t[1]}</MenuItem>)}
                                </Select>
                            </FormControl>
                            {filters.map((f, index) => getFilterSelector(f, index))}
                            <div style={{
                                width: "100%", paddingTop: 10, paddingBottom: 10,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <Button onClick={applyFilter}>Apply Filter</Button>
                                {/*<Button onClick={() => setFilter([...filters, {key: "", value: ""}])}>*/}
                                {/*    Add Filter</Button>*/}
                                <Button onClick={() => {
                                    // clearFilter();
                                    setOpen((previousOpen) => !previousOpen);
                                    // enhancedTableBodyRef.current?.clearFilter();
                                }}>Close</Button>
                            </div>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </React.Fragment>
    );
}
