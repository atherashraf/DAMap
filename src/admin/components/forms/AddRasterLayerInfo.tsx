import * as React from "react";
import {ChangeEvent, useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MapApi, {MapAPIs} from "../../../ol-map/utils/MapApi";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';


interface IProps {
    snackbarRef: React.RefObject<DASnackbar>
}

const AddRasterLayerInfo = (props: IProps) => {
    const [rasterFile, setRasterFile] = useState<File>();
    const [filePath, setFilePath] = useState<string>("")
    const [rasterType, setRasterType] = React.useState("existing");
    const [sldFile, setSldFile] = useState<File>();
    const [layerTitle, setLayerTitle] = useState<string>("");
    const [layerCategories, setLayerCategories] = useState<any>([])
    const [selectLayerCatId, setSelectLayerId] = useState<string>("")
    const handleRegionFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setRasterFile(e.target.files[0]);
            setFilePath(e.target.files[0].name)
        }
    };

    const handleLayerCategoryChange = (e) => {
        setSelectLayerId(e.target.value as string)
    }

    const handleUpdatedToChange = (event: SelectChangeEvent) => {
        setRasterType(event.target.value);
        if (event.target.value == "existing") {
            setFilePath("")
        }
    };


    const handleSidFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSldFile(e.target.files[0]);
        }
    };
    const api = new MapApi(props.snackbarRef);
    React.useEffect(() => {
        api.get(MapAPIs.DCH_LAYER_CATEGORIES).then((payload) => {
            setLayerCategories(payload)
        })
    }, [])
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(event.currentTarget.elements)
    }

    return (

        <Box
            sx={{
                display: "block",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px",
            }}
        >
            <form onSubmit={handleSubmit}>
                <Box sx={{margin: "30px"}}>
                    <TextField id="raster-path-id" label="Layer Title" variant="standard" fullWidth={true}
                               value={layerTitle} onChange={(e) => setLayerTitle(e.target.value as string)}
                               required={true} error={layerTitle === ""}
                    />
                </Box>
                <Box sx={{margin: "30px"}}>
                    <FormControl variant="standard" fullWidth={true}>
                        <InputLabel id="demo-simple-select-standard-label">
                            Layer Category
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={rasterType}
                            autoWidth
                            onChange={handleLayerCategoryChange}
                            fullWidth={true}

                        >
                            {layerCategories && layerCategories.map((item) => <MenuItem
                                value={item.value}>{item.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{margin: "30px"}}>
                    <FormControl variant="standard" fullWidth={true}>
                        <InputLabel id="demo-simple-select-standard-label">
                            Raster Type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={rasterType}
                            autoWidth
                            onChange={handleUpdatedToChange}
                            label="Raster Type"
                            fullWidth={true}
                            required={true}
                            defaultValue={"existing"}
                        >
                            <MenuItem value="new">New / Upload</MenuItem>
                            <MenuItem value="existing">Existing</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>
                    {rasterType === "new" &&
                        <><InputLabel>Select Raster</InputLabel>
                            <Button variant="contained" component="label">
                                Upload File
                                <input type="file" onChange={handleRegionFileChange} hidden/>
                            </Button><br/></>}


                    <TextField id="raster-path-id" label="Raster File Path" variant="standard"
                               value={filePath} onChange={(e) => setFilePath(e.target.value as string)}
                               required={true} error={filePath === ""}
                    />
                </Box>
                <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>
                    <InputLabel>Temporal Resolution</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Basic date picker"/>
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
                <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>
                    <InputLabel>Select SID</InputLabel>
                    <Button variant="contained" component="label">
                        Upload File
                        <input type="file" onChange={handleSidFileChange} hidden/>
                    </Button>
                    <p style={{color: "black"}}>{sldFile && `${sldFile.name}`}</p>
                </Box>
                <Box sx={{margin: "30px"}}>
                    {/*<Button*/}
                    {/*    type={"submit"}*/}
                    {/*    sx={{backgroundColor: "black"}}*/}
                    {/*    variant="contained"*/}
                    {/*    component="span"*/}
                    {/*    onClick={handleSubmit}*/}
                    {/*>*/}
                    {/*    Create Layer*/}
                    {/*</Button>*/}
                    <Button type="submit"  sx={{backgroundColor: "black", color:"white"}} variant="contained">Create Layer</Button>
                    &nbsp; &nbsp;

                    <Button
                        sx={{backgroundColor: "black"}}
                        variant="contained"
                        component="span"
                        disabled={true}
                    >
                        Layer Designer
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default AddRasterLayerInfo;

