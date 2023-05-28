import * as React from "react";
import {useState} from "react"
import MapVM from "../models/MapVM";
import {Button, FormControl} from '@mui/material';
import WeatherLayers from "../layers/WeatherLayers";
import TypeAhead from "../../widgets/TypeAhead";

interface AddLayerPanelProps {
    mapVM: MapVM,
    layers: any
}

let wLayers: any = null;
const AddLayerPanel = (props: AddLayerPanelProps) => {
    const mapVM = props.mapVM
    if (!wLayers) {
        wLayers = new WeatherLayers(mapVM)
    }
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
    const weatherLayers = [
        {"uuid": "1", "title": "Clouds", "layer_name": "clouds_new"},
        {"uuid": "2", "title": "Precipitation", "layer_name": "precipitation_new"},
        {"uuid": "3", "title": "Wind Speed", "layer_name": "wind_new"},
        {"uuid": "4", "title": "Temperature", "layer_name": "temp_new"},
        {"uuid": "5", "title": "Weather Data", "layer_name": "weather_data"}
    ]

    // React.useEffect(() => {
    //     const elem = document.getElementById('div-add_layer') as HTMLElement
    //     mapVM.identifyFeature(elem)
    // }, [])
    const [selectedOption, setSelectedOption] = useState(options[0].uuid);
    const [selectedWeatherOption, setSelectedWeatherOption] = useState(weatherLayers[4].layer_name);
    const handleOptionChange = (selectedOption: any) => {
        setSelectedOption(selectedOption.uuid);
    };
    const handleWeatherOptionChange = (selectedOption: any) => {
        setSelectedWeatherOption(selectedOption.layer_name);
    };
    const handelAddButton = async () => {
        await props.mapVM.addDALayer({uuid: selectedOption})
    }
    const handelAddWeatherButton = async () => {
        console.log(selectedWeatherOption)
        if (selectedWeatherOption === "weather_data") {
            wLayers.getWeatherData(selectedWeatherOption)
        } else {
            wLayers.addTileWeatherMap(selectedWeatherOption)
        }
    }

    return (
        <React.Fragment>
            <div className="panel">
                <h3>Add New Layer</h3>
                <FormControl style={{display: "flex"}}>
                    <TypeAhead data={options} inputLabel={"Select Layer"}
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
