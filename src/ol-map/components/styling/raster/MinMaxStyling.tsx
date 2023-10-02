import * as React from "react";
import { Box, FormControl, TextField } from "@mui/material";
import ColorRamp from "../atoms/ColorRamp";
import { RefObject } from "react";
import MapVM from "../../../models/MapVM";
import AddStyleButton from "../atoms/AddStyleButton";
import LegendGrid from "../atoms/LegendGrid";
import { IRule } from "../../../TypeDeclaration";
import Button from "@mui/material/Button";
import { MapAPIs } from "../../../utils/MapApi";

interface IProps {
  mapVM: MapVM;
  bandInfo: any;
}

interface IState {
  noOfClasses: number;
  styleList: Array<IRule>;
}

class MinMaxStyling extends React.PureComponent<IProps, IState> {
  colorRampRef: RefObject<ColorRamp> = React.createRef<ColorRamp>();
  legendGridRef: RefObject<LegendGrid> = React.createRef<LegendGrid>();

  constructor(props: IProps) {
    super(props);
    this.state = {
      noOfClasses: 3,
      styleList: [],
      // currentIndex: 0
    };
  }

  calculateClassValue(classIndex: number) {
    const { bandInfo } = this.props;
    const percentile = Math.round((classIndex / this.state.noOfClasses) * 100);

    let value;
    if (percentile >= 0 && percentile <= 25) {
      // gap = percentile/25 * 100
      value = bandInfo.min + ((bandInfo.q25 - bandInfo.min) * percentile) / 25;
    } else if (percentile >= 25 && percentile <= 50) {
      value =
        bandInfo.q25 +
        ((bandInfo.median - bandInfo.q25) * (percentile - 25)) / 25;
    } else if (percentile >= 50 && percentile <= 75) {
      value =
        bandInfo.median +
        ((bandInfo.q75 - bandInfo.median) * (percentile - 50)) / 25;
    } else {
      value =
        bandInfo.q75 + ((bandInfo.max - bandInfo.q75) * (percentile - 75)) / 25;
    }
    return value;
  }

  addStyles() {
    const styles = [];
    for (let i = 0; i < this.state.noOfClasses; i++) {
      const value = this.calculateClassValue(i);
      const c = this.colorRampRef.current?.getColor(this.state.noOfClasses, i);
      //@ts-ignore
      styles.push({ title: value.toFixed(3), style: { fillColor: c } });
    }
    this.setState({
      styleList: styles,
    });
  }

  removeStyles() {
    this.setState({
      styleList: [],
    });
  }

  // updateStyleItem(index: number, styleRule: IRule) {
  //     const data = this.state.styleList.map((item: IRule, i: number) => i == index ?
  //         Object.assign(item, {style: style}) : item)
  //     this.setState(() => ({styleList: data}))
  // }
  updateStyleItem(index: number, styleRule: IRule) {
    this.setState({
      styleList: [
        ...this.state.styleList.slice(0, index),
        Object.assign({}, this.state.styleList[index], styleRule),
        ...this.state.styleList.slice(index + 1),
      ],
    });
  }

  saveStyle() {
    this.props.mapVM.showSnackbar("Creating new style");

    const values: any[] = [];
    const palette: any[] = [];
    this.state.styleList.forEach((item) => {
      values.push(parseFloat(item.title));
      palette.push(item.style.fillColor);
    });
    const res = {
      min_val: this.props.bandInfo.min,
      max_val: this.props.bandInfo.max,
      values: values,
      palette: palette,
    };

    this.props.mapVM
      .getApi()
      .post(MapAPIs.DCH_SAVE_STYLE, res, {
        uuid: this.props.mapVM.getLayerOfInterest(),
      })
      .then(() => {
        this.props.mapVM.showSnackbar("Style save successfully");
        const daLayer = this.props.mapVM.getDALayer(
          this.props.mapVM.getLayerOfInterest()
        );
        setTimeout(() => daLayer?.refreshLayer(), 2000);
      });
  }

  render() {
    const layerId = this.props.mapVM.getLayerOfInterest();
    return (
      <React.Fragment>
        <Box sx={{ flex: 1, pt: 1 }}>
          <FormControl fullWidth size={"small"}>
            {/*<InputLabel id="select-value-label">Select Point Size</InputLabel>*/}
            <TextField
              type={"number"}
              value={this.state.noOfClasses}
              label="No of Classes"
              size={"small"}
              onChange={(e) =>
                this.setState({
                  noOfClasses: parseInt((e.target.value as string) || "0"),
                })
              }
              InputProps={{
                inputMode: "numeric",
                inputProps: { min: 1, max: 10 },
              }}
            />
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, pt: 1, alignItems: "center" }}>
          Color Ramp:
          <ColorRamp ref={this.colorRampRef} mapVM={this.props.mapVM} />
        </Box>
        <Box sx={{ flex: 1, pt: 1, alignItems: "center" }}>
          <AddStyleButton
            menuList={[
              {
                name: "Add Style",
                handleClick: this.addStyles.bind(this),
              },
              {
                name: "Remove Styles",
                handleClick: this.removeStyles.bind(this),
              },
            ]}
          />
        </Box>

        {/*{this.state.styleList.length > 0 &&*/}
        <LegendGrid
          ref={this.legendGridRef}
          styleList={this.state.styleList}
          updateStyleItem={this.updateStyleItem.bind(this)}
          mapVM={this.props.mapVM}
          layerId={layerId}
        />
        {/*}*/}
        <Box sx={{ flex: 1, pt: 1, alignItems: "center" }}>
          <Button
            color={"primary"}
            sx={{ width: "100%" }}
            variant="contained"
            onClick={this.saveStyle.bind(this)}
          >
            Save Style
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

export default MinMaxStyling;
