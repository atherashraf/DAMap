import MapVM from "../models/MapVM";
import {RefObject} from "react";
import RightDrawer from "../components/drawers/RightDrawer";
import leftDrawer from "../components/drawers/LeftDrawer";
import LeftDrawer from "../components/drawers/LeftDrawer";



export interface IControlProps {
    mapVM: MapVM
    drawerRef? : RefObject<RightDrawer> | RefObject<leftDrawer>
}
export interface IMapToolbarProps {
    target?: any
    mapVM: MapVM
    rightDrawerRef: RefObject<RightDrawer>
    leftDrawerRef: RefObject<LeftDrawer>
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
    style?: DAFeatureStyle
    zoomRange: number[]
}

export interface IMapInfo {
    title: string
    layers: {uuid:string, style: DAFeatureStyle, visible:boolean}[]
    extent: number[]
    srid: number
    units: string
    description?: string
}

export interface DAStyle{
    type: string
}

export interface DAFeatureStyle extends DAStyle {
    style: {
        default: DAGeomStyle
        columnName?: string
        rules?: DARule[]
    }
}

export interface DAGeomStyle {
    strokeColor?: string
    strokeWidth?: number
    fillColor?: string
}

export interface DARule extends DAGeomStyle {
    value: string
}
