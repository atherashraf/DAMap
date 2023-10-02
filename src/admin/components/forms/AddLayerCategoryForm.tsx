import * as React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { RefObject } from "react";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import MapApi, { MapAPIs } from "../../../ol-map/utils/MapApi";

interface IProps {
  handleBack: Function;
  snackbarRef: RefObject<DASnackbar>;
}

const AddLayerCategoryForm = (props: IProps) => {
  const [mainCategory, setMainCategory] = React.useState<string>("");
  const [subCategory, setSubCategory] = React.useState<string>("");
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("main", mainCategory);
    formData.append("sub", subCategory);
    formData.append("model_name", "layercategory");
    const api = new MapApi(props.snackbarRef);
    api.postFormData(MapAPIs.DCH_ADD_MODEL_ROW, formData).then((payload) => {
      if (payload) {
        props.snackbarRef?.current?.show("Category added successfully");
      }
    });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "block",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Typography>Add Layer Category</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ margin: "30px" }}>
            <TextField
              id="main-category"
              label="Main Category"
              variant="standard"
              fullWidth={true}
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value as string)}
              required={true}
              error={mainCategory === ""}
            />
          </Box>
          <Box sx={{ margin: "30px" }}>
            <TextField
              id="sub-category"
              label="Sub Category"
              variant="standard"
              fullWidth={true}
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as string)}
              required={true}
              error={subCategory === ""}
            />
          </Box>

          <Box sx={{ margin: "30px" }}>
            <Button
              type="submit"
              sx={{ backgroundColor: "black", color: "white" }}
              variant="contained"
            >
              Create Category
            </Button>
            &nbsp; &nbsp;
            <Button
              sx={{ backgroundColor: "black" }}
              variant="contained"
              component="span"
              onClick={() => {
                setMainCategory("");
                setSubCategory("");
                props.handleBack();
              }}
            >
              Back
            </Button>
          </Box>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default AddLayerCategoryForm;
