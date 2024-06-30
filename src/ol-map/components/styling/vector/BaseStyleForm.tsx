import * as React from "react";
import MapVM from "../../../models/MapVM";

export interface BaseStyleFormProps {
  layerId: string;
  mapVM: MapVM;
}

// @ts-ignore
abstract  class BaseStyleForm<P = {}, S = {}> extends React.PureComponent<
  BaseStyleFormProps,
  any
> {
  abstract getFeatureStyle(): void

  render() {
    return <React.Fragment></React.Fragment>;
  }
}

export default BaseStyleForm;
