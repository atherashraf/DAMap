import * as React from "react";
import {useParams} from "react-router-dom";
import MapView from "./MapView";
import {RefObject, useRef} from "react";
import TimeSlider, {IDateRange} from "../components/controls/TimeSlider";
import MVTLayer from "../layers/da_layers/MVTLayer";
import OverlayVectorLayer, {IOverLayVectorInfo} from "ol-map/layers/overlay_layers/OverlayVectorLayer";
import MapVM from "../models/MapVM";

interface IProps {
    isEditor?: boolean;
}

const DAMap = (props: IProps) => {
    const {mapId} = useParams();
    //@ts-ignore
    const mapViewRef: React.RefObject<MapView> = useRef();
    const timeSliderRef: RefObject<TimeSlider> = React.createRef();
    const onDateChange = (date: Date) => {
        const uuid: string = "3d070b54566111eeaaaeacde48001122";
        // @ts-ignore
        const daLayer: MVTLayer = mapViewRef?.current?.getMapVM().getDALayer(uuid);
        if (daLayer) {
            daLayer.updateTemporalData(date);
        }
    };
    const addFloodLayer = () => {
        const mapVM = mapViewRef.current?.getMapVM()
        if (mapVM) {
            const floodLayerData = require("../layers/overlay_layers/test_data/flood_layer.json")

            const info: IOverLayVectorInfo = {
                uuid: MapVM.generateUUID(),
                title: "flood layer",
                style: {
                    type: "single",
                    style: {
                        default: {
                            strokeColor: "#111160",
                            strokeWidth: 2,
                            fillColor: "#2e2e9422"
                        }
                    }
                }
            }
            const floodLayer = new OverlayVectorLayer(info, mapVM)
            console.log(floodLayerData)
            floodLayer.addGeojsonFeature(floodLayerData.payload)
            console.log(floodLayer.toGeoJson())
        }
    }
    let slider: any;
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (mapViewRef && !slider) {
                slider = mapViewRef?.current
                    ?.getMapVM()
                    ?.addTimeSliderControl(timeSliderRef, onDateChange);
                const minDate = new Date();
                minDate.setDate(minDate.getDate() - 10);
                const s: IDateRange = {
                    minDate: minDate,
                    maxDate: new Date(),
                };
                setTimeout(() => timeSliderRef?.current?.setDateRange(s), 2000);
                slider && clearInterval(interval);
            }
        });
        setTimeout(() => addFloodLayer(), 10000)
    }, []);
    return (
        <div style={{width: "100%", height: "calc(100% - 30px)"}}>
            {props.isEditor ? (
                <MapView
                    ref={mapViewRef}
                    uuid={mapId}
                    isMap={true}
                    isEditor={props.isEditor}
                />
            ) : (
                <MapView ref={mapViewRef} uuid={mapId} isMap={true}/>
            )}
        </div>
    );
};

export default DAMap;
