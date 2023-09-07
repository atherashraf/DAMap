import * as React from "react";
import {useState} from "react"
import MapVM from "../models/MapVM";
import {Button, FormControl} from '@mui/material';
import WeatherLayers, {IWeatherLayer, weatherLayers} from "../layers/WeatherLayers";
import TypeAhead from "../../widgets/TypeAhead";

interface AddLayerPanelProps {
    mapVM: MapVM,
    layers: any
}


const AddLayerPanel = (props: AddLayerPanelProps) => {
    const mapVM = props.mapVM
    const options = props.layers.sort((a, b) => {
        let fa = a.title.toLowerCase(),
            fb = b.title.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })


    // React.useEffect(() => {
    //     const elem = document.getElementById('div-add_layer') as HTMLElement
    //     mapVM.identifyFeature(elem)
    // }, [])
    const [selectedOption, setSelectedOption] = useState<string>(options[0].uuid);
    const [selectedWeatherOption, setSelectedWeatherOption] = useState<IWeatherLayer>(weatherLayers[4]);
    const handleOptionChange = (selectedOption: any) => {
        setSelectedOption(selectedOption.uuid);
    };
    const handleWeatherOptionChange = (selectedOption: any) => {
        setSelectedWeatherOption(selectedOption);
    };
    const handelAddButton = async () => {
        await props.mapVM.addDALayer({uuid: selectedOption})
    }
    const handelAddWeatherButton = async () => {
        props.mapVM.addWeatherLayer(selectedWeatherOption)
    }

    return (
        <React.Fragment>
            <div className="panel">
                <h3>Add New Layer</h3>
                <FormControl style={{display: "flex"}}>
                    <TypeAhead data={props.layers} inputLabel={"Select Layer"}
                               optionLabelKey={"title"} onChange={handleOptionChange}/>
                </FormControl>
                <Button style={{marginTop: "5px"}} variant="contained" color="primary" onClick={handelAddButton}>Add
                    Layer</Button>
                <div id={"div-add_layer"} style={{width: "100%", height: "auto"}}/>
                <h3>Add Weather Layer</h3>
                <FormControl style={{display: "flex"}}>
                    <TypeAhead data={weatherLayers}
                               optionLabelKey={"title"}
                               inputLabel={"Select Weather Layer"}
                               onChange={handleWeatherOptionChange}/>
                </FormControl>
                <Button style={{marginTop: "5px"}} variant="contained" color="primary" onClick={handelAddWeatherButton}>Add
                    Weather Layer</Button>
            </div>

        </React.Fragment>
    )
}
export default AddLayerPanel
