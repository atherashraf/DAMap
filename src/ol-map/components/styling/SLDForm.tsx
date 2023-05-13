import * as React from "react";
import MapApi, {MapAPIs} from "../../utils/MapApi";
import MapVM from "../../models/MapVM";
import {FileUpload} from "@mui/icons-material";
import Button from "@mui/material/Button";

interface  IProps{
    mapVM : MapVM
}

const SLDForm = (props: IProps) => {
    const [fileToUpload, setFileToUpload] = React.useState(null)

    const handleFilesChange = (e: any) => {
        uploadFile(e.target.files[0])
    };

    const uploadFile = (file: any) => {
        // Create a form and post it to server
        let formData = new FormData()
        // fileToUpload.forEach((file) => formData.append("files", file))
        formData.append("file", file)
        const layerId = props.mapVM.getLayerOfInterest();
        props.mapVM.getApi().postFormData(MapAPIs.DCH_SAVE_SLD, formData, {uuid: layerId}).then((payload) => {
            if (payload) {
                props.mapVM.showSnackbar("SLD uploaded successfully")
                const daLayer = props.mapVM.getDALayer(layerId)
                daLayer.updateStyle()
            }
        })

    }

    return (
        <>
            <Button
                variant="outlined"
                component="label"
                fullWidth={true}
            >
                Upload File
                <input
                    type="file"
                    onChange={handleFilesChange}
                    hidden
                />
            </Button>
        </>
    )
}

export default SLDForm
