import * as React from "react";
import MapVM from "../models/MapVM";
interface MapVMProps {
    height?: number;
    uuid: string;
    isMap: boolean;
    isDesigner?: boolean;
}
interface MapVMState {
}
declare class MapView extends React.PureComponent<MapVMProps, MapVMState> {
    private mapDivId;
    private domRefs;
    private readonly mapVM;
    constructor(props: MapVMProps);
    getMapVM(): MapVM;
    getMapDivId(): string;
    componentDidMount(): void;
    render(): JSX.Element;
}
export default MapView;
