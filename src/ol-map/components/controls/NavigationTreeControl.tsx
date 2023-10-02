import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { IControlProps } from "../../TypeDeclaration";
import NavigationTree from "../NavigationTree";

const NavigationTreeControl = (props: IControlProps) => {
  const handleClick = () => {
    props.drawerRef?.current?.addContents(
      "Map Navigation",
      <NavigationTree mapVM={props.mapVM} />
    );
    props.drawerRef?.current?.openDrawer();
    // props.mapVM.refreshMap();
    // props.mapVM.identifyFeature();
  };
  return (
    <React.Fragment>
      <Tooltip title={"Map Navigation"}>
        <IconButton sx={{ padding: "3px" }} onClick={handleClick}>
          <AccountTreeIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default NavigationTreeControl;
