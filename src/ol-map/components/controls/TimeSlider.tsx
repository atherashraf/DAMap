import { Box } from "@mui/material";
import * as React from "react";
import JqxSlider, {
  ISliderProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxslider";
import MapVM from "../../models/MapVM";

export interface IDateRange {
  minDate: Date;
  maxDate: Date;
}

interface IProps {
  mapVM: MapVM;
  onDateChange: Function;
}

interface IState extends ISliderProps {
  selectedDate: Date;
  cmpWidth: number;
}

class TimeSlider extends React.PureComponent<IProps, IState> {
  private dateSlider = React.createRef<JqxSlider>();
  //@ts-ignore
  private minDate: Date;
  //@ts-ignore
  private maxDate: Date;

  constructor(props: IProps) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.state = {
      height: 60,
      max: this.getNoOfDays(),
      min: 0,
      mode: "fixed",
      showTickLabels: true,
      step: 1,
      tickLabelFormatFunction: this.tickLabelFormatFunction,
      ticksFrequency: 30,
      tooltip: true,
      tooltipFormatFunction: this.tooltipFormatFunction,
      value: this.getNoOfDays(),
      //@ts-ignore
      selectedDate: undefined,
      cmpWidth: 200,
    };
    // this.getDateRange();
    window.onresize = this.onResize.bind(this);
  }

  public setDateRange = (data: IDateRange) => {
    if (data) {
      this.maxDate = data["maxDate"];
      this.minDate = data["minDate"];
      this.setState({
        value: this.getNoOfDays(),
        max: this.getNoOfDays(),
        selectedDate: this.maxDate,
      });
    }
  };

  private getNoOfDays = () => {
    return (
      (this.maxDate?.getTime() - this.minDate?.getTime()) /
      (24 * 60 * 60 * 1000)
    );
  };
  private tooltipFormatFunction = (value: any) => {
    return this?.getCurrentDate(value)?.toDateString();
  };

  private getCurrentDate = (value) => {
    if (this.minDate) {
      const daysInMilliSec =
        this.minDate.getTime() + value * 24 * 60 * 60 * 1000;
      const d = new Date();
      d.setTime(daysInMilliSec);
      return d;
    }
    return null;
  };
  private tickLabelFormatFunction = () => {
    // if (value === 0) { return this.minDate; }
    // if (value === 365) { return this.maxDate; }
    return "";
  };

  // private redSliderOnChange(event: any): void {
  //     console.log(event)
  // }

  // private updateDischargeData = (date: Date) => {
  //     try {
  //         // console.log("Updating Discharge Data", date);
  //         const daLayer = this.props.mapVM.getDALayer(this.props.layerUUID);
  //         if (date && daLayer) {
  //             const params = "date=" + date?.toISOString().split('T')[0]
  //             daLayer.setAdditionalUrlParams(params)
  //             daLayer.refreshLayer()
  //             // NetworkUtils.updateDischargeDate(date)
  //             // console.log(params)
  //         }
  //     } catch (e) {
  //         // console.error("Invalid Date", e)
  //     }
  // }

  private onDateChange(event: any): void {
    const value = event.args.value;
    const date = this.getCurrentDate(value);
    this.props.onDateChange(date);
    // if (this.shouldIgnoreCall) {
    //     return;
    // }
    // this.shouldIgnoreCall = true;
    // setTimeout(() => {
    //     const date = this.getCurrentDate(value);
    //     this.shouldIgnoreCall = false
    //     if (date) {
    //         this.updateDischargeData(date)
    //     }
    //
    // }, 1000)
  }

  private onResize = () => {
    //@ts-ignore
    const width = (document?.getElementById("map")?.clientWidth / 5) | 200;
    this.setState({ cmpWidth: width });
  };

  render() {
    return (
      <Box sx={{ width: 300 }}>
        <JqxSlider
          ref={this.dateSlider}
          onChange={this.onDateChange}
          height={this.state.height}
          width={this.state.cmpWidth}
          max={this.state.max}
          min={this.state.min}
          mode={this.state.mode}
          showTickLabels={this.state.showTickLabels}
          step={this.state.step}
          tickLabelFormatFunction={this.state.tickLabelFormatFunction}
          ticksFrequency={this.state.ticksFrequency}
          tooltip={this.state.tooltip}
          tooltipFormatFunction={this.state.tooltipFormatFunction}
          value={this.state.value}
          // onChange={this.onDateChange.bind(this)}
        />
      </Box>
    );
  }
}

export default TimeSlider;
