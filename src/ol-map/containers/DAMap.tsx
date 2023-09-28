import * as React from "react"
import {useParams} from "react-router-dom";
import MapView from "./MapView";
import {RefObject, useRef} from "react";
import TimeSlider, {IDateRange} from "../components/controls/TimeSlider";
import MVTLayer from "../layers/MVTLayer";
import {formatYmdDate} from "../components/controls/TimeSliderControl";

interface IProps {
    isEditor?: boolean
}


const DAMap = (props: IProps) => {
    const {mapId} = useParams()
    //@ts-ignore
    const mapViewRef: React.RefObject<MapView> = useRef();
    const timeSliderRef: RefObject<TimeSlider> = React.createRef()
    const layerUUID4Slider: string = "3d070b54566111eeaaaeacde48001122";
    const onDateChange = (date: Date) => {
        // @ts-ignore
        const daLayer: MVTLayer = mapViewRef?.current?.getMapVM().getDALayer(layerUUID4Slider)
        const params = "date=" + formatYmdDate(date)
        //             daLayer.setAdditionalUrlParams(params)
        if (daLayer) {
            daLayer.setAdditionalUrlParams(params)
            daLayer.refreshLayer()
        }

    }
    let slider: any;
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (mapViewRef && !slider) {
                console.log("in interval")
                slider = mapViewRef?.current?.getMapVM()?.addTimeSliderControl(timeSliderRef, onDateChange);
                console.log(slider)
                const minDate = new Date();

                minDate.setDate(minDate.getDate() - 10)
                const s: IDateRange = {
                    minDate: minDate,
                    maxDate: new Date()
                }
                setTimeout(() => timeSliderRef?.current?.setDateRange(s), 2000)
                slider && clearInterval(interval)
            }

        })
    }, [])
    return (
        <div style={{"width": "100%", height: "calc(100% - 30px)"}}>
            {props.isEditor ?
                <MapView ref={mapViewRef} uuid={mapId} isMap={true} isEditor={props.isEditor}/> :
                <MapView ref={mapViewRef} uuid={mapId} isMap={true}/>
            }
        </div>

    )
}

export default DAMap
