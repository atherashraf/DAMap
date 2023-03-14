import * as React from "react";
import {useEffect} from "react"
import {Box, Button, FormControl, InputLabel, MenuItem, SelectChangeEvent} from "@mui/material";
import {DAFieldSet, DASelect} from "../StyledMapComponent";
import SingleStyleForm from "./forms/SingleStyleForm";
import BaseStyleForm from "./forms/BaseStyleForm";
import MapVM from "../../models/MapVM";
import {IFeatureStyle} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import DensityStyleForm from "./forms/DensityStyleForm";
import MultipleStyleForm from "./forms/MultipleStyleForm";


export interface SymbologySettingProps {
    // layerId: string
    mapVM: MapVM
}

const SymbologySetting = (props: SymbologySettingProps) => {
    const [styleType, setStyleType] = React.useState('');
    const layerId = props.mapVM.getLayerOfInterest()
    const currentStyle = props.mapVM.getDALayer(layerId)?.style;
    useEffect(() => {
        if (currentStyle)
            setStyleType(currentStyle.type);
    }, [currentStyle])


    const styleTypes = [{name: "Single", val: "single"},
        {name: "Multiple", val: "multiple"},
        {name: "Density", val: "density"}]
    const styleFormRef = React.createRef<BaseStyleForm>()
    const handleSelectType = (event: SelectChangeEvent) => {
        const styleType = event.target.value as string
        setStyleType(styleType)
    };

    const handleSetStyle = () => {
        const style: IFeatureStyle = styleFormRef.current.getFeatureStyle()
        // style.style.default.pointShape = pointShape
        // style.style.rules = style.style.rules.map((rule) => {
        //     rule.style.pointShape = pointShape
        //     return rule
        // })
        // console.log("set style", style)
        const daLayer = props.mapVM.getDALayer(layerId)
        daLayer.setStyle(style)
    }
    const handleSaveStyle = () => {
        const style: IFeatureStyle = styleFormRef.current?.getFeatureStyle()
        props.mapVM.getApi().post(MapAPIs.DCH_SAVE_STYLE, style, {uuid: layerId}).then(() => {
            props.mapVM.showSnackbar("Style save successfully")
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


                {styleType === "single" ?
                    <SingleStyleForm key={"single-style"} layerId={layerId}
                                     mapVM={props.mapVM}
                        // pointShape={pointShape}
                        //@ts-ignore
                                     ref={styleFormRef}/>
                    : styleType === "density" ?
                        <DensityStyleForm key={"density-style"} layerId={layerId}
                                          mapVM={props.mapVM}
                            // pointShape={pointShape}
                            //@ts-ignore
                                          ref={styleFormRef}/>
                        : styleType === "multiple" ?
                            <MultipleStyleForm key={"multiple-style"} mapVM={props.mapVM}
                                               layerId={layerId}
                                // pointShape={pointShape}
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
