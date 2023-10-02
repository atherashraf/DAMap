import * as React from "react";
import { Box, TextField } from "@mui/material";
import { Row } from "../../widgets/grid/GridTypeDeclaration";

interface IProps {
  row: Row;
}

const EditForm = (props: IProps) => {
  const handleSubmit = () => {};

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        {Object.keys(props.row).map((key) => (
          <Box sx={{ margin: "30px" }}>
            <TextField
              id="raster-path-id"
              label="Layer Title"
              variant="standard"
              fullWidth={true}
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
  );
};

export default EditForm;
