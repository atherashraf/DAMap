import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { IControlProps } from "../../TypeDeclaration";

const Zoom2Extent = (props: IControlProps) => {
  return (
    <React.Fragment>
      <Tooltip title={"Zoom to Map Extent"}>
        <IconButton
          sx={{ padding: "3px" }}
          onClick={() => props.mapVM.zoomToFullExtent()}
        >
          <ZoomInMapIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default Zoom2Extent;
