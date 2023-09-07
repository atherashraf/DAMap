import {Menu} from "@mui/material"
import * as React from "react"
import MenuItem from "@mui/material/MenuItem";
import MapVM from "../../models/MapVM";
import mapVM from "../../models/MapVM";
import SymbologySetting from "../styling/SymbologySetting";
import MapApi, {MapAPIs} from "../../utils/MapApi";

export interface IContextMenu {
    mouseX: number
    mouseY: number
}

interface IProps {
    layer: any
    mapVM: MapVM
    contextMenu?: IContextMenu
}

const LayerMenu = (props: IProps) => {
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
        setOpen(Boolean(props.contextMenu))
    }, [props.contextMenu])
    const handleClose = () => {
        setOpen(false)
    }
    const menuItems = {
        common: [
            {name: "Open Attribute Table", id: "table", inEditor: false}
        ],
        inEditor: [
            {name: "Open Layer Designer", id: "designer"},
            {name: "Download style", id: "downloadStyle"}
        ]
    }
    const handleClick = (option: string) => {
        const uuid = props.layer.get("name");
        switch (option) {
            case "designer":
                props.mapVM.setLayerOfInterest(uuid)
                const drawerRef = props.mapVM.getRightDrawerRef()
                drawerRef?.current?.addContents("Layer Styler",
                    <SymbologySetting key={"symbology-setting"}
                                      mapVM={props.mapVM}/>)
                drawerRef?.current?.openDrawer()
                break
            case "table":
                props.mapVM.setLayerOfInterest(uuid)
                setTimeout(() => props.mapVM.openAttributeTable(), 1000);
                break
            case "downloadStyle":
                const url = MapApi.getURL(MapAPIs.DCH_DOWNLOAD_DA_STYLE, {uuid: uuid})
                window.open(url);
            default:
                break
        }
    }
    const isEditor = props.mapVM.isMapEditor();
    return (
        <React.Fragment>
            <Menu
                // anchorEl={props.anchorEl}
                anchorReference="anchorPosition"
                anchorPosition={
                    props.contextMenu !== null
                        ? {top: props.contextMenu.mouseY, left: props.contextMenu.mouseX}
                        : undefined
                }
                id="layer-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                {menuItems["common"].map((item) => <MenuItem key={item.id}
                                                             onClick={() => handleClick(item.id)}>{item.name}</MenuItem>)}
                {isEditor && menuItems["inEditor"].map((item) => <MenuItem key={item.id}
                                                                           onClick={() => handleClick(item.id)}>{item.name}</MenuItem>)}

            </Menu>
        </React.Fragment>
    )

}

export default LayerMenu
