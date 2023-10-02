import * as React from "react";
import MapVM from "../models/MapVM";

interface IdentifyResultProps {
  mapVM: MapVM;
}

const IdentifyResult = (props: IdentifyResultProps) => {
  const { mapVM } = props;
  React.useEffect(() => {
    const elem = document.getElementById("div-identify-result") as HTMLElement;
    mapVM.identifyFeature(elem);
  }, []);
  return (
    <React.Fragment>
      <div
        id={"div-identify-result"}
        style={{ width: "auto", height: "auto" }}
      />
    </React.Fragment>
  );
};

export default IdentifyResult;
