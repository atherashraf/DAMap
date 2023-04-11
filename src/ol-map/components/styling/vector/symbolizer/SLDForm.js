import * as React from "react";
import MapApi, {MapAPIs} from "../../../../utils/MapApi";
import MapVM from "../../../../models/MapVM";
import {FileUpload} from "@mui/icons-material";
import Button from "@mui/material/Button";


const SLDForm = (props) => {
    const [fileToUpload, setFileToUpload] = React.useState(null)

    const handleFilesChange = (e) => {
        uploadFile(e.target.files[0])
    };

    const uploadFile = (file) => {
        // Create a form and post it to server
        let formData = new FormData()
        // fileToUpload.forEach((file) => formData.append("files", file))
        formData.append("file", file)
        const layerId = props.mapVM.getLayerOfInterest();
        props.mapVM.getApi().postFile(MapAPIs.DCH_SAVE_SLD, formData, {uuid: layerId}).then((payload) => {
            if (payload) {
                props.mapVM.showSnackbar("SLD uploaded successfully")
                const daLayer = props.mapVM.getDALayer(layerId)
                daLayer.updateStyle()
            }
        })
        // const url = MapApi.getURL(MapAPIs.DCH_SAVE_SLD, {uuid: layerId})
        // props.mapVM.showSnackbar("Saving SLD style")
        // const headers = new Headers()
        // fetch(url, {
        //     method: "POST",
        //     body: formData
        // }).then((payload) => {
        //     props.mapVM.showSnackbar("SLD uploaded successfully")
        //     const daLayer = props.mapVM.getDALayer(layerId)
        //     daLayer.updateStyle()
        // })
    }

    return (
        <>
            {/*<FileUpload*/}
            {/*    multiFile={false}*/}
            {/*    onFilesChange={handleFilesChange}*/}
            {/*    onContextReady={function () {*/}
            {/*    }}*/}

            {/*    buttonLabel="click here"*/}
            {/*    buttonRemoveLabel="Remove all"*/}
            {/*/>*/}
            {/*<button onClick={uploadFiles}>Upload</button>*/}

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
            {/*<Button onClick={uploadFile}>*/}
            {/*    Upload*/}
            {/*</Button>*/}
        </>
    )
}

export default SLDForm
