import * as React from "react";
import JqxWindow from "jqwidgets-scripts/jqwidgets-react-tsx/jqxwindow";
import JqxInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxinput";
import JqxNumberInput from "jqwidgets-scripts/jqwidgets-react-tsx/jqxnumberinput";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import {Box, TextField} from "@mui/material";
import {Row} from "../../widgets/GridTypeDeclaration";

interface IProps {
    row: Row
}

const EditForm = (props: IProps) =>{

    const handleSubmit = () =>{

    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                {Object.keys(props.row).map((key, index)=> (
                    <Box sx={{margin: "30px"}}>
                        <TextField id="raster-path-id" label="Layer Title" variant="standard" fullWidth={true}
                                   value={props.row[key]}
                                   // onChange={(e) =>
                                   //     setLayerTitle(e.target.value as string)}
                                   required={true}
                                   // error={layerTitle === ""}
                        />
                    </Box>
                ))}

            </form>
        </React.Fragment>
    )
}

export default EditForm
