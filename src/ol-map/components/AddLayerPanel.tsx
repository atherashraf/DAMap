import * as React from "react";
import {useState} from "react"
import MapVM from "../models/MapVM";
import {Button, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import WeatherLayers from "../layers/WeatherLayers";

interface AddLayerPanelProps {
    mapVM: MapVM,
    layers: any
}

let wLayers = null;
const AddLayerPanel = (props: AddLayerPanelProps) => {
    const mapVM = props.mapVM
    if (!wLayers) {
        wLayers = new WeatherLayers(mapVM)
    }
    const options = props.layers
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
    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };
    const handleWeatherOptionChange = (event: any) => {
        setSelectedWeatherOption(event.target.value);
    };
    const handelAddButton = async () => {
        await props.mapVM.addDALayer({uuid: selectedOption})
    }
    const handelAddWeatherButton = async () => {
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
                    <InputLabel id="dropdown-label">Select Layer</InputLabel>
                    <Select
                        labelId="dropdown-label"
                        id="dropdown"
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        {options.map((option: any) => (
                            <MenuItem key={option.uuid} value={option.uuid}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button style={{marginTop: "5px"}} variant="contained" color="primary" onClick={handelAddButton}>Add
                    Layer</Button>
                <div id={"div-add_layer"} style={{width: "100%", height: "auto"}}/>
                <h3>Add Weather Layer</h3>
                <FormControl style={{display: "flex"}}>
                    <InputLabel id="dropdown-label">Select Weather Layer</InputLabel>
                    <Select
                        labelId="dropdown-label"
                        id="dropdown"
                        value={selectedWeatherOption}
                        onChange={handleWeatherOptionChange}
                    >
                        {weatherLayers.map((option: any) => (
                            <MenuItem key={option.title} value={option.layer_name}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button style={{marginTop: "5px"}} variant="contained" color="primary" onClick={handelAddWeatherButton}>Add
                    Weather Layer</Button>
            </div>

        </React.Fragment>
    )
}
export default AddLayerPanel
