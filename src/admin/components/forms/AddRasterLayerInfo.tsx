import * as React from "react";
import {ChangeEvent, useState} from "react";
import {Box, Button, FormGroup, Stack, TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MapApi, {MapAPIs} from "../../../ol-map/utils/MapApi";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import AddLayerCategoryForm from "./AddLayerCategoryForm";
import DAFullScreenDialog from "../../../common/DAFullScreenDialog";
import LayerCategoryControl from "./LayerCategoryControl";

interface IProps {
    snackbarRef: React.RefObject<DASnackbar>
    dialogRef: React.RefObject<DAFullScreenDialog>
}

interface ILayerCategory {
    pk: string
    name: string
}

const AddRasterLayerInfo = (props: IProps) => {
    const navigate = useNavigate();
    const [formType, setFormType] = useState<"LayerCategory" | null>(null)
    const [rasterFile, setRasterFile] = useState<File>();
    const [worldFile, setWorldFile] = useState<File>()
    const [rasterFilePath, setRasterFilePath] = useState<string>("")
    const [worldFilePath, setWorldFilePath] = useState<string>("")
    const [rasterType, setRasterType] = React.useState("new");
    const [sldFile, setSldFile] = useState<File>();
    const [layerTitle, setLayerTitle] = useState<string>("");
    const [selectLayerCat, setSelectLayerCat] = useState<ILayerCategory>()
    const [temporalRes, setTemporalRes] = useState<any>(null)
    const [uuid, setUUID] = useState<string>()
    const handleRasterFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setRasterFile(e.target.files[0]);
            setRasterFilePath(e.target.files[0].name)
        }
    };
    const handleWorldFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setWorldFile(e.target.files[0]);
            setWorldFilePath(e.target.files[0].name)
        }
    }

    const handleLayerCategoryChange = (e) => {
        setSelectLayerCat(e.target.value as ILayerCategory)
    }

    const handleUpdatedToChange = (event: SelectChangeEvent) => {
        setRasterType(event.target.value);
        if (event.target.value == "existing") {
            setRasterFilePath("")
        }
    };


    const handleSldFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSldFile(e.target.files[0]);
        }
    };
    const api = new MapApi(props.snackbarRef);
    const handleSubmit = (event: any) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("title", layerTitle);
        formData.append("isExisting", (rasterType == "existing").toString())
        if (rasterType == "existing") {
            formData.append("rasterFilePath", rasterFilePath)
        } else {
            formData.append("rasterFile", rasterFile)
            formData.append("worldFile", worldFile)
        }

        formData.append("categoryId", selectLayerCat.pk)
        formData.append("temporal", temporalRes.format("YYYY-MM-DD"))
        formData.append("sldFile", sldFile)
        api.postFormData(MapAPIs.DCH_ADD_RASTER_INFO, formData).then((payload) => {
            console.log(payload)
            props.snackbarRef.current?.show(payload.msg)
            setUUID(payload.uuid)
        })

    }
    return (
        <React.Fragment>
            {formType === "LayerCategory" ? <AddLayerCategoryForm snackbarRef={props.snackbarRef} handleBack={
                    () => {
                        setFormType(null)
                    }}/>
                :
                <Box sx={{
                    display: "block",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px",
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{margin: "30px"}}>
                            <TextField id="raster-path-id" label="Layer Title" variant="standard" fullWidth={true}
                                       value={layerTitle} onChange={(e) => setLayerTitle(e.target.value as string)}
                                       required={true} error={layerTitle === ""}
                            />
                        </Box>
                        <Box sx={{margin: "30px"}}>
                            <LayerCategoryControl api={api} setLayerCategory={
                                (layerCategory: ILayerCategory) => setSelectLayerCat(layerCategory)}
                                                  handleAddLayerCategory={() => setFormType("LayerCategory")}/>
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
                                        <input type="file" onChange={handleRasterFileChange} hidden/>
                                    </Button><br/></>}


                            <TextField id="raster-path-id" label="Raster File Path" variant="standard"
                                       value={rasterFilePath}
                                       onChange={(e) => setRasterFilePath(e.target.value as string)}
                                       required={true} error={rasterFilePath === ""}
                            />
                        </Box>
                        {rasterType === "new" &&
                            <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>

                                <><InputLabel>Select World File</InputLabel>
                                    <Button variant="contained" component="label">
                                        Upload World File
                                        <input type="file" onChange={handleWorldFileChange} hidden/>
                                    </Button><br/></>


                                <TextField id="worldfile-path-id" label="World File Path" variant="standard"
                                           value={worldFilePath}
                                />
                            </Box>}

                        <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>
                            <InputLabel>Temporal Resolution</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker value={temporalRes} onChange={(e) => {
                                        // console.log(e)
                                        setTemporalRes(e)
                                    }}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                        <Box sx={{margin: "30px", display: "flex", flexDirection: "column"}}>
                            <InputLabel>Select SLD</InputLabel>
                            <Button variant="contained" component="label">
                                Upload File
                                <input type="file" onChange={handleSldFileChange} hidden/>
                            </Button>
                            <p style={{color: "black"}}>{sldFile && `${sldFile.name}`}</p>
                        </Box>
                        <Box sx={{margin: "30px"}}>
                            <Button type="submit" sx={{backgroundColor: "black", color: "white"}} variant="contained">Create
                                Layer</Button>
                            &nbsp; &nbsp;

                            <Button
                                sx={{backgroundColor: "black"}}
                                variant="contained"
                                component="span"
                                disabled={!uuid}
                                onClick={() => {
                                    navigate("/designer/" + uuid)
                                }}
                            >
                                Layer Designer
                            </Button>
                            &nbsp; &nbsp;
                            <Button type="submit" sx={{backgroundColor: "black", color: "white"}}
                                    variant="contained" onClick={() => {
                                props.dialogRef.current.handleClose()
                                window.location.reload()
                            }}>
                                Close</Button>

                        </Box>
                    </form>
                </Box>
            }
        </React.Fragment>
    );
};

export default AddRasterLayerInfo;

