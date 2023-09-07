import {Box, Button, FormControl, InputLabel, MenuItem, SelectChangeEvent} from "@mui/material";
import {DAFieldSet, DASelect} from "../StyledMapComponent";
import SingleStyleForm from "./vector/SingleStyleForm";
import DensityStyleForm from "./vector/DensityStyleForm";
import MultipleStyleForm from "./vector/MultipleStyleForm";
import * as React from "react";
import {IFeatureStyle} from "../../TypeDeclaration";
import {MapAPIs} from "../../utils/MapApi";
import BaseStyleForm from "./vector/BaseStyleForm";
import {useEffect} from "react";
import MapVM from "../../models/MapVM";
import SLDForm from "./SLDForm";

interface IVectorStylingProps {
    mapVM: MapVM
}

const VectorStyling = (props: IVectorStylingProps) => {
    const styleFormRef = React.createRef<BaseStyleForm>()
    const [styleType, setStyleType] = React.useState('');
    const styleTypes = [{name: "SLD / DA Style", val: "sld"}, {name: "Single", val: "single"},
        {name: "Multiple", val: "multiple"},
        {name: "Density", val: "density"}]
    const layerId = props.mapVM.getLayerOfInterest()
    const currentStyle = props.mapVM.getDALayer(layerId)?.style;
    useEffect(() => {
        if (currentStyle)
            setStyleType(currentStyle.type);
    }, [currentStyle])

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
        props.mapVM.showSnackbar("Saving new style")
        const mapUUID = props.mapVM.isMapEditor()? props.mapVM.getMapUUID(): -1
        props.mapVM.getApi().post(MapAPIs.DCH_SAVE_STYLE, style, {uuid: layerId, map_uuid: mapUUID}).then(() => {
            props.mapVM.showSnackbar("Style save successfully")
            const daLayer = props.mapVM.getDALayer(layerId);
            daLayer.updateStyle();
            props.mapVM.refreshMap();
        });
    }
    const handleRemoveStyle = () => {
        const style = ""
        props.mapVM.showSnackbar("Removing style")
        const mapUUID = props.mapVM.isMapEditor ? props.mapVM.getMapUUID() : -1
        props.mapVM.getApi().post(MapAPIs.DCH_SAVE_STYLE, style, {uuid: layerId, map_uuid: mapUUID}).then(() => {
            props.mapVM.showSnackbar("Style removed successfully")
            const daLayer = props.mapVM.getDALayer(layerId);
            // daLayer.setStyle(null)
            daLayer.updateStyle();

            // daLayer.refreshLayer()
            // props.mapVM.refreshMap()
        });
    }
    return (
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


            {styleType === "sld" ? <SLDForm mapVM={props.mapVM}/> :
                styleType === "single" ?
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
            {styleType !== "sld" &&
                <Box sx={{m: 1}}>
                    <Button fullWidth={true} color={"success"}
                            variant={"contained"}
                            onClick={handleSaveStyle}
                    >Save Style</Button>
                </Box>
            }
            <Box sx={{m: 1}}>
                <Button fullWidth={true} color={"primary"}
                        variant={"contained"}
                        onClick={handleRemoveStyle}
                >Remove Style</Button>
            </Box>
        </DAFieldSet>
    )
}

export default VectorStyling
