import * as React from "react";
import { IControlProps } from "../../TypeDeclaration";

const LOISelector = (props: IControlProps) => {
  const [layerIds, setLayerIds] = React.useState<string[]>([]);
  window.addEventListener("DALayerAdded", () => {
    const k: string[] = Object.keys(props.mapVM.daLayers);
    setLayerIds(k);
    // props.mapVM.setLayerOfInterest(k[0])
  });
  return (
    <React.Fragment>
      <select
        id={"loi-select"}
        style={{
          backgroundColor: "white",
          border: "2px solid #000",
          width: "200px",
        }}
        onChange={(e) =>
          props.mapVM.setLayerOfInterest(e.target.value as string)
        }
      >
        <option key={"opt-empty"} value={""}>
          Select Layer of Interest
        </option>
        {layerIds.map((layerId, index) => {
          const layer = props.mapVM.getDALayer(layerId);
          return (
            <option key={"opt-" + index} value={layerId}>
              {layer?.getLayerTitle()}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};

export default LOISelector;
