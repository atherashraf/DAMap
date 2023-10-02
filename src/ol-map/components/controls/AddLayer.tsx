import * as React from "react";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IControlProps } from "../../TypeDeclaration";
import AddLayerPanel from "../AddLayerPanel";
import { MapAPIs } from "../../utils/MapApi";

const AddLayer = (props: IControlProps) => {
  const handleClick = () => {
    props.drawerRef?.current?.openDrawer();
    props.drawerRef?.current?.addContents(
      "Add Layer",
      <Box
        display="flex"
        sx={{ mt: 3 }}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
    props.mapVM.getSnackbarRef()?.current?.show("Getting Layer List...");
    props.mapVM.api.get(MapAPIs.DCH_GET_ALL_LAYERS).then((payload) => {
      if (payload) {
        props.drawerRef?.current?.addContents(
          "Add Layer",
          <AddLayerPanel mapVM={props.mapVM} layers={payload} />
        );
        // props.mapVM.refreshMap();
      } else {
        props.drawerRef?.current?.addContents(
          "Add Layer",
          <Box>No Layer Found</Box>
        );
      }
    });
  };
  return (
    <React.Fragment>
      <Tooltip title={"Add Layer"}>
        <IconButton sx={{ padding: "3px" }} onClick={handleClick}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default AddLayer;
