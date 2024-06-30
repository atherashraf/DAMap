import MapVM from "../../models/MapVM";
import * as React from "react";
import { DAFieldSet, DASelect } from "../StyledMapComponent";
import MinMaxStyling from "./raster/MinMaxStyling";
import { MapAPIs } from "../../utils/MapApi";
import {
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import PredefinedStyling from "./raster/PredefinedStyling";
import SLDForm from "./SLDForm";

interface IRasterStylingProps {
  mapVM: MapVM;
}

const RasterStyling = (props: IRasterStylingProps) => {
  const uuid = props.mapVM.getLayerOfInterest();
  const [rasterInfo, setRasterInfo] = React.useState<any>();
  const [styleType, setStyleType] = React.useState("");
  const styleTypes = [
    { name: "SLD", val: "sld" },
    { name: "Min Max Stretch", val: "min-max" },
    { name: "Predefined Style", val: "predefined" },
  ];
  const getRasterInfo = React.useCallback(() => {
    props.mapVM
      .getApi()
      .get(MapAPIs.DCH_RASTER_DETAIL, { uuid: uuid })
      .then((payload) => {
        if (payload) {
          setRasterInfo(payload);
        }
      });
  },[props.mapVM, uuid]);
  React.useEffect(() => {
    if (!rasterInfo) {
      getRasterInfo();
    }
  }, [getRasterInfo, rasterInfo]);
  const handleSelectType = (event: SelectChangeEvent) => {
    const styleType = event.target.value as string;
    setStyleType(styleType);
  };
  return (
    <DAFieldSet>
      <legend>Raster Styling</legend>
      {/*{rasterInfo?.bandCount == 1 ?*/}
      <FormControl fullWidth size="small">
        <InputLabel id="style-type-label">Style Type</InputLabel>
        <DASelect
          labelId="style-type-label"
          id="style-type-select"
          value={styleType}
          label="Style Type"
          //@ts-ignore
          onChange={handleSelectType}
        >
          {styleTypes.map(({ name, val }) => (
            <MenuItem key={`${name}-key`} value={val}>
              {name}
            </MenuItem>
          ))}
        </DASelect>
      </FormControl>
      {styleType === "min-max" ? (
        //@ts-ignore
        <MinMaxStyling
          mapVM={props.mapVM}
          bandInfo={rasterInfo?.bandsInfo[0]}
        />
      ) : styleType === "predefined" ? (
        <PredefinedStyling mapVM={props.mapVM} />
      ) : styleType === "sld" ? (
        <SLDForm mapVM={props.mapVM} />
      ) : (
        <React.Fragment />
      )}
    </DAFieldSet>
  );
};

export default RasterStyling;
