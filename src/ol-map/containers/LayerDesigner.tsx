import * as React from "react";
import MapView from "./MapView";
import {useParams} from "react-router-dom";
import TimeSliderControl, {formatYmdDate} from "../components/controls/TimeSliderControl";
import {RefObject, useRef} from "react";
import TimeSlider, {IDateRange} from "../components/controls/TimeSlider";
import MVTLayer from "../layers/MVTLayer";


interface LayerDesignerProps {
    // layerId?: string
}

const timeSliderRef: RefObject<TimeSlider> = React.createRef()
const LayerDesigner = () => {
    const { layerId } = useParams();
    //@ts-ignore
    const mapViewRef: React.RefObject<MapView> = useRef();
    // let slider: TimeSliderControl
    // const layerId = "2378481c-cfe1-11ed-924d-367dda4cf16d"
    // const layerId = "6e0f2ab0-d53d-11ed-82a6-acde48001122"
    // const layerId = "04fc474e-da80-11ed-85fe-601895253350"
    const onDateChange = (date: Date) =>{

        const uuid :string = "3d070b54566111eeaaaeacde48001122";
        // @ts-ignore
        const daLayer: MVTLayer = mapViewRef?.current?.getMapVM().getDALayer(uuid)
        const params = "date=" + formatYmdDate(date)
        //             daLayer.setAdditionalUrlParams(params)
        if(daLayer) {
            daLayer.setAdditionalUrlParams(params)
            daLayer.refreshLayer()
        }

    }
    let slider: any = null;
    React.useEffect(() => {
        const interval = setInterval(() => {
            if(mapViewRef && !slider) {
                slider = mapViewRef?.current?.getMapVM()?.addTimeSliderControl(timeSliderRef, onDateChange);
                const minDate = new Date();
                minDate.setDate(minDate.getDate() - 10)
                const s: IDateRange = {
                    minDate: minDate,
                    maxDate: new Date()
                }
                setTimeout(() => timeSliderRef?.current?.setDateRange(s), 2000)
            }
            clearInterval(interval)
        })
    },[])
    return (
        <React.Fragment>
            <MapView ref={mapViewRef} uuid={layerId} isMap={false} isDesigner={true}/>
        </React.Fragment>
    )
}

export default LayerDesigner
