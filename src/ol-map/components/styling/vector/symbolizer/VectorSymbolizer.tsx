import autoBind from "auto-bind";
import * as React from "react";
import { Box, TextField } from "@mui/material";
import DAColorPicker from "../../DAColorPicker";
import { IGeomStyle } from "../../../../TypeDeclaration";
import PointSymbolizer from "./PointSymbolizer";
import _ from "../../../../utils/lodash";

interface IProp {
  geomType: string[] | undefined;
  style?: IGeomStyle;
}

interface IState {
  strokeWidth: number | undefined;
  errorStrokeWidth: string | undefined;
  errorNoOfClasses: string | undefined;
  strokeColor: string | undefined;
  fillColor: string | undefined;
}

class VectorSymbolizer extends React.PureComponent<IProp, IState> {
  minStrokeWidth = 1;
  maxStrokeWidth = 10;
  strokeColorRef = React.createRef<DAColorPicker>();
  fillColorRef = React.createRef<DAColorPicker>();
  pointSymbolRef = React.createRef<PointSymbolizer>();

  constructor(props: any) {
    super(props);
    autoBind(this);
    const { style } = this.props;
    this.state = {
      strokeWidth: style?.strokeWidth || 1,
      errorStrokeWidth: "",
      errorNoOfClasses: "",
      strokeColor: style?.strokeColor || "#404abf",
      fillColor: style?.fillColor || "rgba(27,32,109,0.67)",
    };
  }

  componentDidUpdate(prevProps: Readonly<IProp>) {
    if (!_.isEqual(prevProps.style, this.props.style)) {
      const style = this.props.style;
      this.setState({
        //@ts-ignore
        strokeWidth: style?.strokeWidth,
        //@ts-ignore
        strokeColor: style?.strokeColor,
        //@ts-ignore
        fillColor: style?.fillColor,
      });
    }
  }
  //@ts-ignore
  getStyleParams(): IGeomStyle | undefined {
    const isError = this.validateForm();
    if (!isError) {
      const params: IGeomStyle = {};
      const ps = this.pointSymbolRef?.current?.getPointSymbolizer();
      if (ps) {
        params.pointSize = ps.pointSize;
        params.pointShape = ps.pointShape;
      }
      if (this.strokeColorRef?.current?.getColor()) {
        params["strokeColor"] = this.strokeColorRef.current.getColor();
        params["strokeWidth"] = this.state.strokeWidth;
      }
      if (this.fillColorRef?.current?.getColor())
        params["fillColor"] = this.fillColorRef.current.getColor();
      return params;
    }
  }

  validateForm() {
    const isStrokeWidthError = this.validateStrokeWidth();
    return isStrokeWidthError;
  }

  validateStrokeWidth(val: number = 0) {
    //@ts-ignore
    val = val ? val : this.state?.strokeWidth;
    let isError = false;
    if (val < this.minStrokeWidth || val > this.maxStrokeWidth) {
      this.setState({ errorNoOfClasses: "classes must be between 1 to 10" });
      isError = true;
    } else {
      //@ts-ignore
      this.setState({ errorNoOfClasses: undefined });
    }
    return isError;
  }

  render() {
    // console.log("geomType", this.props.geomType)
    return (
      <React.Fragment>
        <Box sx={{ flex: 1 }}>
          <PointSymbolizer
            ref={this.pointSymbolRef}
            pointSize={this.props?.style?.pointSize}
            //@ts-ignore
            pointShape={this.props?.style?.pointShape}
          />
        </Box>
        {/*Stroke Width*/}
        <Box sx={{ flex: 1 }}>
          <fieldset>
            <legend>Stroke Width</legend>
            <TextField
              type={"number"}
              color={"primary"}
              variant={"outlined"}
              fullWidth={true}
              value={this.state?.strokeWidth}
              onChange={(e) => {
                this.setState({ strokeWidth: parseInt(e.target.value) });
                this.validateStrokeWidth(parseInt(e.target.value));
              }}
              onBlur={(e) => this.validateStrokeWidth(parseInt(e.target.value))}
              required
              error={Boolean(this.state?.errorStrokeWidth)}
              helperText={this.state?.errorStrokeWidth}
              InputProps={{
                inputProps: {
                  min: this.minStrokeWidth,
                  max: this.maxStrokeWidth,
                },
              }}
            />
          </fieldset>
        </Box>

        {/*Stroke Color*/}
        <Box sx={{ flex: 1 }}>
          <DAColorPicker
            ref={this.strokeColorRef}
            label={"Stroke Color"}
            color={this.state.strokeColor}
            isAlpha={false}
          />
        </Box>

        {/*Fill Color*/}
        <Box sx={{ flex: 1 }}>
          <DAColorPicker
            ref={this.fillColorRef}
            label={"Fill Color"}
            color={this.state.fillColor}
            isAlpha={true}
          />
        </Box>
      </React.Fragment>
    );
  }
}

export default VectorSymbolizer;

// export default  VectorStyleForm;
