import React from "react"
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {DAFieldSet, DASelect} from "../StyledMapComponent";
import SingleStyleForm from "./forms/SingleStyleForm";
import BaseStyleForm from "./forms/BaseStyleForm";
import MapVM from "../../models/MapVM";
import {DAFeatureStyle} from "../../utils/TypeDeclaration";
import Api, {APIs} from "../../../Api";
import CommonUtils from "../../utils/CommonUtils";
import DensityStyleForm from "./forms/DensityStyleForm";

export interface SymbologySettingProps {
    // layerId: string
    mapVM: MapVM
}

const SymbologySetting = (props: SymbologySettingProps) => {
    const [styleType, setStyleType] = React.useState('');
    const layerId = props.mapVM.getLayerOfInterest()
    const styleTypes = [{name: "Single", val: "single"}, {name: "Density", val: "density"}]
    // const [styleForm, setStyleForm] = React.useState<JSX.Element>(<></>);
    const styleFormRef = React.createRef<BaseStyleForm>()
    const handleSelectType = (event: SelectChangeEvent) => {
        const styleType = event.target.value as string
        setStyleType(styleType)

    };
    const handleSetStyle = () => {
        // @ts-ignore
        const style: DAFeatureStyle = styleFormRef.current.getStyleParams()
        const daLayer = props.mapVM.getDALayer(layerId)
        daLayer.setStyle(style)
    }
    const handleSaveStyle = () => {
        // @ts-ignore
        const style: DAFeatureStyle = styleFormRef.current.getStyleParams()
        Api.post(APIs.DCH_SAVE_STYLE, style, {uuid: layerId}).then((payload) => {
            // @ts-ignore
            CommonUtils.showSnackbar(payload.msg)
        });

    }
    return (
        <Box sx={{width: "100%", boxSizing: "border-box", p: 1}}>
            <DAFieldSet>
                <legend>Vector Styling</legend>
                <FormControl fullWidth size="small">
                    <InputLabel id="style-type-label">Style Type</InputLabel>
                    <DASelect
                        labelId="style-type-label"
                        id="style-type-select"
                        value={styleType}
                        label="Style Type"
                        onChange={handleSelectType}
                    >
                        {styleTypes.map(({name, val}) =>
                            <MenuItem key={`${name}-key`} value={val}>{name}</MenuItem>)}
                    </DASelect>
                </FormControl>

                {styleType == "single" ?
                    <SingleStyleForm key={"single-style"} layerId={layerId}
                        //@ts-ignore
                                     ref={styleFormRef}/>
                    : styleType == "density" ?
                        <DensityStyleForm key={"density-style"} layerId={layerId}
                            //@ts-ignore
                                          ref={styleFormRef}/>
                        : <></>
                }

                <Box sx={{m: 1}}>
                    <Button fullWidth={true} color={"primary"}
                            variant={"contained"}
                            onClick={handleSetStyle}
                    >Set Style</Button>
                </Box>
                <Box sx={{m: 1}}>
                    <Button fullWidth={true} color={"success"}
                            variant={"contained"}
                            onClick={handleSaveStyle}
                    >Save Style</Button>
                </Box>
            </DAFieldSet>
        </Box>
    )
}

export default SymbologySetting
