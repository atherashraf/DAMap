import * as React from "react";
import MapVM from "../models/MapVM";
interface IProps {
    mapVM: MapVM;
}
interface IState {
    drawerHeight: number;
    mapPadding: number;
    display: "none" | "block";
    contents: JSX.Element;
}
declare class MapPanel extends React.PureComponent<IProps, IState> {
    private mapDivId;
    constructor(props: IProps);
    getMapHeight(): number;
    getMapWidth(): number;
    isBottomDrawerOpen(): boolean;
    closeBottomDrawer(): void;
    openBottomDrawer(height: number, contents?: JSX.Element): void;
    closeDrawer(): void;
    render(): JSX.Element;
}
export default MapPanel;
