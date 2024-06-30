import * as React from "react";
import { useParams } from "react-router-dom";
import MapView from "./MapView";
import { RefObject, useRef, useEffect } from "react";
import TimeSlider, { IDateRange } from "../components/controls/TimeSlider";
import MVTLayer from "../layers/da_layers/MVTLayer";

interface IProps {
    isEditor?: boolean;
}

const DAMap = (props: IProps) => {
    const { mapId } = useParams();
    //@ts-ignore
    const mapViewRef: React.RefObject<MapView> = useRef();
    const timeSliderRef: RefObject<TimeSlider> = useRef(null);
    const sliderRef = useRef<any>(null);

    const onDateChange = (date: Date) => {
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
    }, [timeSliderRef]);

    return (
        <div style={{ width: "100%", height: "calc(100% - 30px)" }}>
            {props.isEditor ? (
                <MapView
                    ref={mapViewRef}
                    uuid={mapId}
                    isMap={true}
                    isEditor={props.isEditor}
                />
            ) : (
                <MapView ref={mapViewRef} uuid={mapId} isMap={true} />
            )}
        </div>
    );
};

export default DAMap;
