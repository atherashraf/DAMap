import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IControlProps } from "../../TypeDeclaration";

const AddClassificationSurface = (props: IControlProps) => {
  const handelAddButton = async () => {
    // @ts-ignore
    const value = "586bcff2-5a85-11ed-beb3-acde48001122";
    console.log("value", value);
    await props.mapVM.addDALayer({ uuid: value });
  };
  return (
    <React.Fragment>
      <Tooltip title={"Zoom to Map Extent"}>
        <IconButton sx={{ padding: "3px" }} onClick={handelAddButton}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default AddClassificationSurface;
