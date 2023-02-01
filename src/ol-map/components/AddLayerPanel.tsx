import * as React from "react";
import {useState} from "react"
import MapVM from "../models/MapVM";
import {Button, FormControl, InputLabel, MenuItem, Select} from '@mui/material';

interface AddLayerPanelProps {
    mapVM: MapVM,
    layers: any
}


const AddLayerPanel = (props: AddLayerPanelProps) => {
    const mapVM = props.mapVM
    const options = props.layers
    React.useEffect(() => {
        const elem = document.getElementById('div-add_layer') as HTMLElement
        mapVM.identifyFeature(elem)
    }, [])
    const [selectedOption, setSelectedOption] = useState(options[0].uuid);
    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };
    const handelAddButton = async () => {
        await props.mapVM.addDALayer({uuid: selectedOption})
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
            </div>

        </React.Fragment>
    )
}
export default AddLayerPanel
