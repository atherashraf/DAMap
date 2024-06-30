import MapVM from "../../../models/MapVM";
import { IGeomStyle } from "../../../TypeDeclaration";
import * as React from "react";
import VectorSymbolizer from "../vector/symbolizer/VectorSymbolizer";
import { RefObject } from "react";
import DADialogBox from "../../common/DADialogBox";
import { Button, Paper } from "@mui/material";
import { getPointSVG } from "../vector/symbolizer/PointSymbolizer";

interface SymbologyIconProps {
  mapVM: MapVM;
  style: IGeomStyle;
  updateStyle: Function;
  index: number;
  geomType: string[];
}

export const LegendIcons = (props: SymbologyIconProps) => {
  const [style, setStyle] = React.useState<IGeomStyle>(props.style);
  const vectorStyleRef = React.createRef<VectorSymbolizer>();
  const dialogBoxRef: RefObject<DADialogBox> = props.mapVM.getDialogBoxRef();

  React.useEffect(() => {
    setStyle(props.style);
  }, [props]);
  const handleApplyStyle = () => {
    const params = vectorStyleRef.current?.getStyleParams();
    // setStyle(params)
    props.updateStyle(params);
  };
  // const handleClose = () => {
  //   dialogBoxRef.current?.closeDialog();
  // };
  const handleClick = () => {
    dialogBoxRef.current?.openDialog({
      content: (
        <Paper elevation={4} sx={{ p: 2, width: 300 }}>
          <VectorSymbolizer
            ref={vectorStyleRef}
            geomType={props.geomType}
            style={props.style}
          />
        </Paper>
      ),
      actions: (
        <React.Fragment>
          <Button onClick={handleApplyStyle} autoFocus>
            Apply
          </Button>
          {/*<Button onClick={handleClose}>Close</Button>*/}
        </React.Fragment>
      ),
    });
  };
  // const {fillColor, strokeColor, strokeWidth} = style
  const getIcon = (): JSX.Element => {
    const gt =
      props.geomType?.length === 1 ? props.geomType[0] : "GeometryCollection";

    switch (gt) {
      case "Point":
      case "MultiPoint":
        return getPointSVG(style);
      case "LineString":
      case "MultiLineString":
        return (
          <svg
            role="img"
            width="75"
            height="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              y1="15"
              x2="75"
              y2="15"
              style={{
                stroke: style?.strokeColor,
                strokeWidth: style?.strokeWidth,
              }}
            />
          </svg>
        );
      default:
        return (
          <svg
            role="img"
            width="75"
            height="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0"
              y="0"
              width="75"
              height="28"
              style={{
                fill: style?.fillColor,
                stroke: style?.strokeColor || style?.fillColor,
                strokeWidth: style?.strokeWidth || 1,
              }}
            />
          </svg>
        );
    }
  };
  // const svg: JSX.Element = getIcon()
  // console.log("svg", svg)
  // setIcon(getIcon())
  return (
    <div onClick={handleClick}>{getIcon()}</div>
    // <Button>Working</Button>
  );
};
