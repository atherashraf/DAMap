/// <reference types="react" />
import MapVM from "../models/MapVM";
interface AddLayerPanelProps {
    mapVM: MapVM;
    layers: any;
}
declare const AddLayerPanel: (props: AddLayerPanelProps) => JSX.Element;
export default AddLayerPanel;
