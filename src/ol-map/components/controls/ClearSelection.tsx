import { IControlProps } from "../../TypeDeclaration";
import { IconButton, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import * as React from "react";

const ClearSelection = (props: IControlProps) => {
  const handleClick = () => {
    props.mapVM.getSelectionLayer().clearSelection();
  };
  return (
    <React.Fragment>
      <Tooltip title={"Clear Selecction"}>
        <IconButton sx={{ padding: "3px" }} onClick={handleClick}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default ClearSelection;
