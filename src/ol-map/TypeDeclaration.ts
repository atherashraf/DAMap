import MapVM from "./models/MapVM";
import {RefObject} from "react";
import RightDrawer from "./components/drawers/RightDrawer";
import leftDrawer from "./components/drawers/LeftDrawer";
import LeftDrawer from "./components/drawers/LeftDrawer";
import DADialogBox from "./components/common/DADialogBox";
import DASnackbar from "./components/common/DASnackbar";
import {pointShapeTypes} from "./components/styling/forms/symbolizer/PointSymbolizer";
import BottomDrawer from "./components/drawers/BottomDrawer";
import MapView from "./containers/MapView";
import MapPanel from "./components/MapPanel";

export interface IBaseMapProps{
    mapVM: MapVM
    layerId?: string
    mapId?: string
}

export interface IControlProps {
    mapVM: MapVM
    drawerRef?: RefObject<RightDrawer> | RefObject<leftDrawer>
}

export interface IDomRef {
    rightDrawerRef?: RefObject<RightDrawer>
    leftDrawerRef?: RefObject<LeftDrawer>
    // bottomDrawerRef?: RefObject<BottomDrawer>
    dialogBoxRef: RefObject<DADialogBox>
    snackBarRef: RefObject<DASnackbar>
    mapPanelRef: RefObject<MapPanel>
}

export interface IMapToolbarProps {
    target?: any
    mapVM: MapVM
    isDesigner: boolean
}

export interface ILayerSourcesInfo {
    source: string;
    imagerySet?: string;
    visible: boolean;
    title: string;
}

export interface ILayerSources {
    [key: string]: ILayerSourcesInfo
}

export interface ILayerInfo {
    title?: string
    uuid: string
    style?: IFeatureStyle
    zoomRange: number[]
    geomType: string[]
}

export interface IMapInfo {
    title: string
    layers: { uuid: string, style: IFeatureStyle, visible: boolean }[]
    extent: number[]
    srid: number
    units: string
    description?: string
}


export interface IFeatureStyle {
    type: "single" | "multiple" | "density" | "sld"
    style: {
        default?: IGeomStyle
        rules?: IRule[]
    }
}

export interface IGeomStyle {
    pointShape?: typeof pointShapeTypes[number]
    pointSize?: number
    strokeColor?: string
    strokeWidth?: number
    fillColor?: string
}

export interface IFilter {
    field: string,
    op: "==" | ">=" | "<=" | ">" | "<" | "!=" | "between",
    value: string | number[],
    logicalOp?: "And" | "Or"
}

export interface IRule {
    title: string
    filter?: IFilter
    style: IGeomStyle

}
