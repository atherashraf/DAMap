import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import {IControlProps} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import AttributeGrid from "../../../widgets/grid/AttributeGrid";

const daGridRef = React.createRef<AttributeGrid>()

const AttributeTable = (props: IControlProps) => {
    let tableHeight = 300;
    const mapBoxRef = props.mapVM.getMapPanelRef()

    const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.height > 0) {
                daGridRef.current?.updateTableHeight(cr.height)
            }
        }
    });
    ro.observe(document.getElementById("bottom-drawer-div"))
    React.useEffect(() => {
        setTimeout(() => props.mapVM.setAttributeTableRef(daGridRef), 500)
    }, [])
    const openAttributeTable = () => {
       props.mapVM.openAttributeTable();
    }
    return (
        <React.Fragment>
            <Tooltip title={"Open Attribute Table"}>
                <IconButton sx={{padding: "3px"}} onClick={openAttributeTable}>
                    <TableChartIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default AttributeTable;
