import MapVM from "./models/MapVM";
import {RefObject} from "react";
import RightDrawer from "./components/drawers/RightDrawer";
import leftDrawer from "./components/drawers/LeftDrawer";
import LeftDrawer from "./components/drawers/LeftDrawer";
import DADialogBox from "./components/common/DADialogBox";
import DASnackbar from "./components/common/DASnackbar";
import {pointShapeTypes} from "./components/styling/vector/symbolizer/PointSymbolizer";
import MapPanel from "./components/MapPanel";
import DAGrid from "../widgets/grid/grid";

export interface IBaseMapProps {
    mapVM: MapVM
    layerId?: string
    mapId?: string
}

export interface IControlProps {
    mapVM: MapVM
    drawerRef?: RefObject<RightDrawer> //| RefObject<leftDrawer>
}

export interface IDomRef {
    rightDrawerRef?: RefObject<RightDrawer>
    leftDrawerRef?: RefObject<LeftDrawer>
    // bottomDrawerRef?: RefObject<BottomDrawer>
    dialogBoxRef: RefObject<DADialogBox>
    snackBarRef: RefObject<DASnackbar>
    mapPanelRef: RefObject<MapPanel>
    attributeTableRef?: RefObject<DAGrid>
}

export interface IMapToolbarProps {
    target?: any
    mapVM: MapVM
    isDesigner: boolean
    isCreateMap: boolean
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
    zoomRange?: number[]
    geomType?: string[]
    dataModel?: string
    category?: string
    dataURL?: string
    extent3857?: []
}

export interface IMapInfo {
    title?: string
    layers: { uuid: string, style: IFeatureStyle, visible: boolean }[]
    extent?: number[]
    srid?: number
    units?: string
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

export interface IGeoJSON {
    type: string
    features: IGeoJSONFeature[],
    crs?: any
}

export interface IGeoJSONFeature {
    type: string
    geometry: any
    properties: any
}

export interface IData {
    [key: string]: any
}
