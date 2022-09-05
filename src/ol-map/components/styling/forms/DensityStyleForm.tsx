import BaseStyleForm, {BaseStyleFormProps} from "./BaseStyleForm";
import {Box, FormControl, InputLabel, MenuItem} from "@mui/material";
import React from "react";
import Api, {APIs} from "../../../../Api";
import {DASelect} from "../../StyledMapComponent";


class DensityStyleForm extends BaseStyleForm {
    constructor(props: BaseStyleFormProps) {
        super(props);
        this.state = {
            fields: [],
            fieldValues: [],
            selectedField: ""
        }
    }

    componentDidMount() {
        Api.get(APIs.DCH_LAYER_FIELDS, {uuid: this.props.layerId})
            .then((payload) => {
                this.setState({fields: payload})
            });
    }
    getFieldName(fieldInfo: any){
        Api.get(APIs.DCH_LAYER_FIELD_VALUE, {uuid: this.props.layerId,
            field_name: fieldInfo.name, field_type:fieldInfo.d_type})
            .then((payload)=>
                this.setState({fieldValues: payload}))
    }
    render() {
        return (
            <Box sx={{flex: 1}}>
                <fieldset>
                    <legend>Select Field</legend>
                    <FormControl fullWidth size="small">
                        <InputLabel id="select-field-label">Select Field</InputLabel>
                        <DASelect
                            labelId="select-field-label"
                            id="select-field-select"
                            value={this.state.selectedField.name}
                            label="Select Field"
                            onChange={(e) => {
                                this.setState({selectedField: e.target.value})
                                this.getFieldName(e.target.value)
                            }}
                        >
                            {this.state.fields.map((field: any) =>
                                <MenuItem key={`${field.name}-key`} value={field}>{field.name}</MenuItem>)}
                        </DASelect>
                    </FormControl>
                    <FormControl fullWidth size={"small"}>
                        <InputLabel id="select-value-label">Select Value</InputLabel>
                        <DASelect
                            labelId="select-value-label"
                            id="select-value-select"
                            value={this.state.selectedField.name}
                            label="Select Value"
                            onChange={(e) => {
                                // this.setState({selectedField: e.target.value})
                            }}
                        >
                            {this.state.fieldValues.map((value: any) =>
                                <MenuItem key={`${value}-key`} value={value}>{value}</MenuItem>)}
                        </DASelect>
                    </FormControl>
                </fieldset>
            </Box>
        );
    }
}

export default DensityStyleForm
