import * as React from "react";
import { Button, Container, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import DAFullScreenDialog from "../../../ol-map/components/common/DAFullScreenDialog";
import Box from "@mui/material/Box";
import LayerCategoryControl, { ILayerCategory } from "./LayerCategoryControl";
import MapApi, { MapAPIs } from "../../../ol-map/utils/MapApi";
import { useState } from "react";
import AddLayerCategoryForm from "./AddLayerCategoryForm";

interface IProps {
  snackbarRef: React.RefObject<DASnackbar>;
  dialogRef: React.RefObject<DAFullScreenDialog>;
}

const AddURLLayerInfo = (props: IProps) => {
  const selectItems = ["WMS", "WFS", "TMS", "Web Api"];
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [layerURL, setLayerURL] = React.useState<string>();
  const [layerTitle, setLayerTitle] = React.useState<string>();

  const [layerCategoryID, setLayerCategoryID] =
    React.useState<ILayerCategory>();
  const [formType, setFormType] = useState<"LayerCategory" | null>(null);

  const mapApi = new MapApi(props.snackbarRef);

  // @ts-ignore
  const getForm = () => {
    switch (formType) {
      case "LayerCategory":
        return (
          <AddLayerCategoryForm
            key={"LayerCategoryFormKey"}
            snackbarRef={props.snackbarRef}
            handleBack={() => setFormType(null)}
          />
        );
    }
  };

  const handleAddLayerInfo = () => {
    mapApi
      .get(MapAPIs.DCH_ADD_URL_LAYER_INFO, {
        layer_title: layerTitle,
        layer_category_id: layerCategoryID,
        layer_url: layerURL,
        url_type: selectedItem,
      })
      .then(() => {});
  };
  return (
    <React.Fragment>
      {formType !== null ? (
        getForm()
      ) : (
        <Container maxWidth="lg" sx={{ p: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select URL Type</InputLabel>
            <Select
              fullWidth={true}
              onChange={(e: SelectChangeEvent) =>
                setSelectedItem(e.target.value as string)
              }
            >
              {/*<MenuItem value={""} selected>Select Upload Type</MenuItem>*/}
              {selectItems.map((item) => (
                <MenuItem key={"menu-" + item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ margin: "30px" }}>
            <TextField
              id="filled-basic"
              label="Layer Title"
              variant="filled"
              fullWidth={true}
              onChange={(e) => setLayerTitle(e.target.value as string)}
            />
          </Box>
          <Box sx={{ margin: "30px" }}>
            <LayerCategoryControl
              api={mapApi}
              setLayerCategory={(layerCategory: ILayerCategory) =>
                setLayerCategoryID(layerCategory)
              }
              handleAddLayerCategory={() => setFormType("LayerCategory")}
            />
          </Box>
          <Box sx={{ margin: "30px" }}>
            <TextField
              id="filled-basic"
              label="Add URL"
              variant="filled"
              fullWidth={true}
              onChange={(e) => setLayerURL(e.target.value as string)}
            />
          </Box>
          <Box sx={{ margin: "30px" }}>
            <Button
              color={"primary"}
              variant={"contained"}
              onClick={handleAddLayerInfo}
            >
              Add Layer Info
            </Button>
          </Box>
        </Container>
      )}
    </React.Fragment>
  );
};
export default AddURLLayerInfo;
