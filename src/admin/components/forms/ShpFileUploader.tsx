import * as React from "react";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import DAFullScreenDialog from "../../../common/DAFullScreenDialog";
import {
    Autocomplete,
    Button,
    Grid,
    Paper,
    Table,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Radio
} from "@mui/material";
import {CheckRounded, ClearRounded, CloudUploadRounded, FileCopyRounded} from "@mui/icons-material";
import MapApi, {MapAPIs} from "../../../ol-map/utils/MapApi";

interface IProps {
    snackbarRef: React.RefObject<DASnackbar>
}

const ShpFileUploader = (props: IProps) => {
    const [files, setFiles] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState([])
    const [selectedValue, setSelectedValues] = React.useState(null)
    const [disableUpload, setDisableUpload] = React.useState(null)

    const handleSelectionChange = (e) => {
        setSelectedValues((e.currentTarget as HTMLInputElement).value);
    }
    const handleOnChange = (e) => {
        const files = e.currentTarget.files;
        // console.log("files", files);
        const rows = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileParts = file.name.split(".");
            // console.log("fileparths", fileParts);
            const index = rows.findIndex((item) => item.name === fileParts[0]);
            const row = index === -1 ? {name: fileParts[0], files: []} : rows[index];
            row.files.push(file);
            switch (fileParts[1]) {
                case "shp":
                    row["shp"] = 1;
                    break;
                case "shx":
                    row["shx"] = 1;
                    break;
                case "dbf":
                    row["dbf"] = 1;
                    break;
                case "prj":
                    row["prj"] = 1;
                    break;
                default:
                    break;
            }
            if (index === -1) rows.push(row);
        }
        setFiles(files)
        setRows(rows)


    }
    const handleSubmit = () => {
        alert("handle submit")
    }
    const uploadShpFile = () => {
        const api = new MapApi(props.snackbarRef);
        const formData = new FormData();
        const row = rows[parseInt(selectedValue)];
        for (let i = 0; i < row.files.length; i++) {
            const file = row.files[i];
            formData.append(file.name, file);
            // formData.append('files[]', file, file.name);
        }
        // formData.append("files", row.files)
        // console.log("formData", formData);
        // console.log("upload started...");
        props.snackbarRef.current?.show("upload started...");
        setDisableUpload(false)
        // const projectId ={"model": "Project", "id": this.state.selProjectId};
        api.postFormData(MapAPIs.DCH_UPLOAD_SHP_FILE, formData ).then((response) => {
            console.log("in upload shapefile", response);
            if (response) {
                props.snackbarRef.current?.show(response.msg);
                console.log("upload res:", response);
                // setTimeout(()=> {
                //   this.props?.history.push({
                //     pathname: "/layer-designer/" + response.data.uuid,
                //     state: {data: response.data}
                //   });
                // }, 3000);
            } else {
                console.log("upload failed");
                props.snackbarRef.current?.show("Failed to upload shape file... Please check with admin.");
                setDisableUpload(false)
            }
        });
    }
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth={true}
                            color={"primary"}
                            component="label"> Select Files <FileCopyRounded/>
                            <input
                                id="shpfile"
                                name="shpfile"
                                accept={".shp, .shx, .prj, .dbf"}
                                type="file"
                                multiple
                                hidden
                                onChange={handleOnChange}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>S#</TableCell>
                                        <TableCell>File Name</TableCell>
                                        <TableCell align="right">shp</TableCell>
                                        <TableCell align="right">shx</TableCell>
                                        <TableCell align="right">dbf</TableCell>
                                        <TableCell align="right">prj</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={row.name}>
                                            <TableCell><Radio
                                                value={index}
                                                checked={selectedValue === index.toString()}
                                                onChange={handleSelectionChange}
                                                name="radio-button-demo"/></TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.shp === 1 ? <CheckRounded/> :
                                                <ClearRounded/>}</TableCell>
                                            <TableCell align="right">{row.shx === 1 ? <CheckRounded/> :
                                                <ClearRounded/>}</TableCell>
                                            <TableCell align="right">{row.dbf === 1 ? <CheckRounded/> :
                                                <ClearRounded/>}</TableCell>
                                            <TableCell align="right">{row.prj === 1 ? <CheckRounded/> :
                                                <ClearRounded/>}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth={true}
                            color={"primary"}
                            disabled={disableUpload}
                            onClick={uploadShpFile}
                        >
                            Upload Files <CloudUploadRounded/>
                        </Button>
                    </Grid>
                    {/*<CircularProgressIndicator/>*/}
                </Grid>
            </form>
        </React.Fragment>
    )
}

export default ShpFileUploader
