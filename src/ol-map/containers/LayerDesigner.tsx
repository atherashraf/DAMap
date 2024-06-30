import * as React from "react";
import MapView from "./MapView";
import {useParams} from "react-router-dom";
import {RefObject, useRef, useEffect} from "react";
import TimeSlider, {IDateRange} from "../components/controls/TimeSlider";
import MVTLayer from "../layers/da_layers/MVTLayer";

const timeSliderRef: RefObject<TimeSlider> = React.createRef();

const LayerDesigner = () => {
    const {layerId} = useParams();
    //@ts-ignore
    const mapViewRef: React.RefObject<MapView> = useRef();
    const sliderRef = useRef<any>(null);
    // let slider: TimeSliderControl
    // const layerId = "2378481c-cfe1-11ed-924d-367dda4cf16d"
    // const layerId = "6e0f2ab0-d53d-11ed-82a6-acde48001122"
    // const layerId = "04fc474e-da80-11ed-85fe-601895253350"

    const onDateChange = (date: Date) => {
        // console.log("on date change", date)
        const uuid: string = "3d070b54566111eeaaaeacde48001122";
        // @ts-ignore
        const daLayer: MVTLayer = mapViewRef?.current?.getMapVM().getDALayer(uuid);
        if (daLayer) {
            daLayer.updateTemporalData(date);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (mapViewRef.current && !sliderRef.current) {
                const mapVM = mapViewRef.current.getMapVM();
                if (mapVM) {
                    sliderRef.current = mapVM.addTimeSliderControl(timeSliderRef, onDateChange);
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() - 10);
                    const s: IDateRange = {
                        minDate: minDate,
                        maxDate: new Date(),
                    };
                    setTimeout(() => timeSliderRef?.current?.setDateRange(s), 2000);
                    clearInterval(interval);
                }
            }
        }, 100);

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);

    return (
        <React.Fragment>
            <MapView
                ref={mapViewRef}
                uuid={layerId}
                isMap={false}
                isDesigner={true}
            />
        </React.Fragment>
    );
};

export default LayerDesigner;
