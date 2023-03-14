/// <reference types="react" />
import MapVM from "../models/MapVM";
import "./LayerSwitcher.css";
interface LayerSwitcherProps {
    mapVM: MapVM;
}
declare const LayerSwitcher: (props: LayerSwitcherProps) => JSX.Element;
export default LayerSwitcher;
