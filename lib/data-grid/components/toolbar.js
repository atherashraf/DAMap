import * as React from "react";
import { alpha } from '@mui/material/styles';
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import PinDropIcon from '@mui/icons-material/PinDrop';
// import {useNavigate} from "react-router-dom";
// import {olMapCtrl} from "../../ol-map/containers/DAMaps";
import FilterMenu from "./FilterMenu";
export const GridToolbar = (props) => {
    const { numSelected } = props;
    const toolbarRef = React.useRef();
    // const navigate = useNavigate()
    const handleSearch = () => {
        const rows = props.data.filter((d) => props.selectedRowIds.indexOf(d.rowId) >= 0);
        if (rows.length > 0) {
            // navigate("/projectInfo?id="+ rows[0].id);
        }
    };
    const handleLocation = () => {
        // const rows = props.data.filter((d: any) => props.selectedRowIds.indexOf(d.rowId) >= 0);
        // console.log("selected rows", rows)
        // olMapCtrl.clearSelectedFeatures();
        // rows.forEach((r: Row) => {
        //     olMapCtrl.selectFeature(r.id);
        // })
        // olMapCtrl.zoomToSelectedFeatures();
    };
    return (React.createElement(Toolbar, { ref: toolbarRef, sx: Object.assign({ height: props.height }, (numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        })) },
        numSelected > 0 ? (React.createElement(Typography, { sx: { flex: '1 1 100%' }, color: "inherit", variant: "subtitle1", component: "div" },
            numSelected,
            " selected")) : (React.createElement(Typography, { sx: { flex: '1 1 100%' }, variant: "h6", id: "tableTitle", component: "div" }, props.tableName)),
        numSelected > 0 ? (React.createElement(React.Fragment, null,
            React.createElement(Tooltip, { title: "Project Location" },
                React.createElement(IconButton, { onClick: handleLocation },
                    React.createElement(PinDropIcon, null))),
            React.createElement(Tooltip, { title: "Search" },
                React.createElement(IconButton, { onClick: handleSearch },
                    React.createElement(SavedSearchIcon, null))))) : (React.createElement(Tooltip, { title: "Filter list" },
            React.createElement(FilterMenu, { data: props.data, columns: props.columns })))));
};
