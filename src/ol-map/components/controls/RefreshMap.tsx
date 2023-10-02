import { IControlProps } from "../../TypeDeclaration";
import { IconButton, Tooltip } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import * as React from "react";

const RefreshMap = (props: IControlProps) => {
  const handleClick = () => {
    const map = props.mapVM.getMap();
    map?.render();
    map?.setSize(map.getSize());
    map?.updateSize();
    props.mapVM?.refreshMap();
  };
  return (
    <React.Fragment>
      <Tooltip title={"Add Layer"}>
        <IconButton sx={{ padding: "3px" }} onClick={handleClick}>
          <AutorenewIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default RefreshMap;
