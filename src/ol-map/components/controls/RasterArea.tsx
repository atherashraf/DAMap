import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { IControlProps } from "../../TypeDeclaration";
import RasterAreaResult from "../RasterAreaResult";

const RasterArea = (props: IControlProps) => {
  const handleClick = () => {
    // console.log("click working...", props.drawerRef);
    props.drawerRef?.current?.addContents(
      "Zonal Stats",
      <RasterAreaResult mapVM={props.mapVM} />
    );
    props.drawerRef?.current?.openDrawer();
    // props.mapVM.refreshMap();
    // props.mapVM.drawPolygonForRasterArea()
  };
  return (
    <React.Fragment>
      <Tooltip title={"Calculate Area"}>
        <IconButton sx={{ padding: "3px" }} onClick={handleClick}>
          <SquareFootIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default RasterArea;
