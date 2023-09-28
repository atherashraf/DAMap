import {Control} from 'ol/control.js';
import {createRoot} from "react-dom/client";
import React, {RefObject} from "react";
import MapVM from "../../models/MapVM";
import TimeSlider from "./TimeSlider";

interface IControlOptions {
    target?: any
    mapVM: MapVM
    timeSliderRef: RefObject<TimeSlider>
    onDateChange: Function
}

export const  formatYmdDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1 and pad with '0'
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
class TimeSliderControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     *  Object will consist of
     *    timeSliderRef: RefObject<TimeSlider> and
     *    onDateChange: Function
     *
     *    timeSliderRef will use for passing dateRange: IDateRange  using
     *       timeSliderRef?.current?.setDateRange({
     *              minDate: new Date(Date.parse("2023-07-23")),
     *              maxDate: new Date(Date.parse("2023-09-23"))
     *       })
     *    onDateChange Function will use for receiving Date
     */
    constructor(opt_options: IControlOptions) {
        // @ts-ignore
        const options: IControlOptions = opt_options || {};

        const element: HTMLDivElement = document.createElement('div');
        element.style.bottom = "30px";
        element.style.left = "35%";
        element.style.position = "absolute";
        const slider = <TimeSlider ref={options.timeSliderRef}
                                   mapVM={options.mapVM} onDateChange={options.onDateChange}/>
        const sliderRoot = createRoot(element)
        // @ts-ignore
        sliderRoot.render(slider)
        super({
            element: element,
            target: options.target,
        });


    }

    handleRotateNorth() {
        console.log(this);
        this.getMap()?.getView()?.setRotation(30);
    }
}

export default TimeSliderControl;
