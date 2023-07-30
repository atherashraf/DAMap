import * as React from "react"
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import DAFullScreenDialog from "../../../common/DAFullScreenDialog";
import {Box, Container} from "@mui/material";
import ShpFileUploader from "./ShpFileUploader";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

interface IProps {
    snackbarRef: React.RefObject<DASnackbar>
    dialogRef: React.RefObject<DAFullScreenDialog>
}

const AddVectorLayerInfo = (props: IProps) => {
    const selectItems = ["Shapefile", "Postgis"]
    const [selectedItem, setSelectedItem] = React.useState<string>("")
    const getSelectedForm = () => {
        switch (selectedItem) {
            case "Shapefile":
                return <ShpFileUploader snackbarRef={props.snackbarRef}/>
            default:
                props.snackbarRef?.current?.show("Please select form type")
        }
    }
    return (
        <React.Fragment>
            <Container maxWidth="lg" sx={{p: 3}}>
                <FormControl fullWidth>
                    <InputLabel>Select Upload Type</InputLabel>
                    <Select fullWidth={true}
                            onChange={(e: SelectChangeEvent) => setSelectedItem(e.target.value as string)}>
                        {/*<MenuItem value={""} selected>Select Upload Type</MenuItem>*/}
                        {selectItems.map((item) => <MenuItem key={"menu-" + item} value={item}>{item}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box>
                    {getSelectedForm()}
                </Box>
            </Container>
        </React.Fragment>
    )
}
export default AddVectorLayerInfo
