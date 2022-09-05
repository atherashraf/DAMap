import autoBind from "auto-bind";
import React from "react";
import {Box, Button, TextField} from "@mui/material";
import DAColorPicker from "../DAColorPicker";
import {DAGeomStyle} from "../../../utils/TypeDeclaration";
// import {Grid} from "@material-ui/core";
// import {FieldSetStyle, StyledTextField} from "../../../../../../static/theme";
// import {withTheme} from "@material-ui/styles";
//
// import CustomColorPicker from "../CustomColorPicker";
// import AbstractStyleForm from "./AbstractStyleForm";
// import * as PropTypes from "prop-types";
// import Button from "@material-ui/core/Button";

class VectorStyleForm extends React.PureComponent<any, any> {
    minStrokeWidth = 1;
    maxStrokeWidth = 10;
    strokeColorRef = React.createRef<DAColorPicker>();
    fillColorRef = React.createRef<DAColorPicker>();
    state = {
        strokeWidth: 1,
        errorStrokeWidth: "",
        errorNoOfClasses: "",
        strokeColor: "#404abf",
        fillColor: "rgba(27,32,109,0.67)"
    };

    constructor(props: any) {
        super(props);
        autoBind(this);
    }

    getStyleParams(): DAGeomStyle {
        const isError = this.validateForm();
        if (!isError) {
            const params: DAGeomStyle = {};
            if (this.strokeColorRef?.current?.getColor()) {
                params["strokeColor"] = this.strokeColorRef.current.getColor();
                params["strokeWidth"] = this.state.strokeWidth;
            }
            if (this.fillColorRef?.current?.getColor())
                params["fillColor"] = this.fillColorRef.current.getColor();
            return params;
        }
        return null;
    }

    validateForm() {
        const isStrokeWidthError = this.validateStrokeWidth();
        return (isStrokeWidthError);
    }

    validateStrokeWidth(val: number = 0) {
        val = val ? val : this.state?.strokeWidth;
        console.log("value", val);
        let isError = false;
        if (val < this.minStrokeWidth || val > this.maxStrokeWidth) {
            this.setState({errorNoOfClasses: "classes must be between 1 to 10"});
            isError = true;
        } else
            this.setState({errorNoOfClasses: null});


        return isError;
    }

    render() {
        // const {vectorType} = this.props;
        // const isPoint = vectorType.indexOf("Point") !== -1;
        // const isPolyline = vectorType.indexOf("LineString") !== -1;
        // const isPolygon = vectorType.indexOf("Polygon") !== -1;
        return (
            <React.Fragment>
                {/*Point Style*/}
                <Box sx={{flex: 1}}>
                    <fieldset>
                        <legend>Icon Style</legend>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth={true}
                            color={"primary"}
                            onClick={() => alert("working...")}
                        >
                            Upload
                            <input
                                type="file"
                                hidden
                            />
                        </Button>
                    </fieldset>

                </Box>
                {/*Stroke Color*/}
                <Box sx={{flex: 1}}>
                    <DAColorPicker ref={this.strokeColorRef} label={"Stroke Color"}
                                   color={this.state.strokeColor}
                                   isAlpha={false}/>
                </Box>
                {/*Stroke Width*/}
                <Box sx={{flex: 1}}>
                    <fieldset>
                        <legend>Stroke Width</legend>
                        <TextField
                            type={"number"}
                            color={"primary"}
                            variant={"outlined"} fullWidth={true} value={this.state?.strokeWidth}
                            onChange={(e) => {
                                this.setState({"strokeWidth": e.target.value});
                                this.validateStrokeWidth(parseInt(e.target.value));
                            }}
                            onBlur={(e) => this.validateStrokeWidth(parseInt(e.target.value))}
                            required error={Boolean(this.state?.errorStrokeWidth)}
                            helperText={this.state?.errorStrokeWidth}
                            InputProps={{
                                inputProps: {
                                    min: this.minStrokeWidth,
                                    max: this.maxStrokeWidth
                                }
                            }}
                        />
                    </fieldset>
                </Box>
                {/*Fill Color*/}
                <Box sx={{flex: 1}}>
                    <DAColorPicker ref={this.fillColorRef} label={"Fill Color"} color={this.state.fillColor}
                                   isAlpha={true}/>
                </Box>
            </React.Fragment>
        )
    }
}

export default VectorStyleForm;

// export default  VectorStyleForm;
