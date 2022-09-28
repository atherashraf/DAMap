import * as React from "react";
import {alpha} from '@mui/material/styles';
import {IconButton, Toolbar, Tooltip, Typography} from "@mui/material";

import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import FilterListIcon from '@mui/icons-material/FilterList';
import PinDropIcon from '@mui/icons-material/PinDrop';
import {EnhancedTableToolbarProps, Row} from "../TypeDeclaration";
// import {useNavigate} from "react-router-dom";
// import {olMapCtrl} from "../../ol-map/containers/DAMaps";
import FilterMenu from "./FilterMenu";


export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const {numSelected} = props;
    // const navigate = useNavigate()
    const handleSearch = () => {
        const rows = props.data.filter((d: any) => props.selectedRowIds.indexOf(d.rowId) >= 0);
        if (rows.length> 0) {
            // navigate("/projectInfo?id="+ rows[0].id);
        }

    }
    const handleLocation = () => {
        const rows = props.data.filter((d: any) => props.selectedRowIds.indexOf(d.rowId) >= 0);
        // console.log("selected rows", rows)
        // olMapCtrl.clearSelectedFeatures();
        rows.forEach((r: Row) => {
            // olMapCtrl.selectFeature(r.id);
        })
        // olMapCtrl.zoomToSelectedFeatures();
    }
    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {props.tableName}
                </Typography>
            )}
            {numSelected > 0 ? (
                <React.Fragment>
                    <Tooltip title="Project Location">
                        <IconButton onClick={handleLocation}>
                            <PinDropIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Search">
                        <IconButton onClick={handleSearch}>
                            <SavedSearchIcon/>
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            ) : (

                <Tooltip title="Filter list">
                    <FilterMenu data={props.data} columns={props.columns}/>
                </Tooltip>
            )}
        </Toolbar>
    );
};
