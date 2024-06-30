import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import { IControlProps } from "../../TypeDeclaration";
import AttributeGrid from "../../../widgets/grid/AttributeGrid";

const daGridRef = React.createRef<AttributeGrid>();

const AttributeTable = (props: IControlProps) => {
  const ro = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      if (cr.height > 0) {
        daGridRef.current?.updateTableHeight(cr.height);
      }
    }
  });
  //@ts-ignore
  ro.observe(document?.getElementById("bottom-drawer-div"));
  React.useEffect(() => {
    setTimeout(() => props.mapVM.setAttributeTableRef(daGridRef), 500);
  }, [props.mapVM]);
  const openAttributeTable = () => {
    props.mapVM.openAttributeTable();
  };
  return (
    <React.Fragment>
      <Tooltip title={"Open Attribute Table"}>
        <IconButton sx={{ padding: "3px" }} onClick={openAttributeTable}>
          <TableChartIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
export default AttributeTable;
