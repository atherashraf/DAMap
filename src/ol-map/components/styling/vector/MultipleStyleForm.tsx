import BaseStyleForm, { BaseStyleFormProps } from "./BaseStyleForm";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { MapAPIs } from "../../../utils/MapApi";
import { DASelect } from "../../StyledMapComponent";
import { IFeatureStyle, IGeomStyle, IRule } from "../../../TypeDeclaration";
import PointSymbolizer, {
  IPointSymbolizerState,
} from "./symbolizer/PointSymbolizer";
import { LegendIcons } from "../atoms/LegendIcons";

interface IProps extends BaseStyleFormProps {}

// interface StyleItem {
//     filter: IFilter
//     style: IGeomStyle
// }

interface FieldInfo {
  name: string;
  d_type: string;
}

interface IState {
  fields: FieldInfo[];
  fieldValues: string[];
  selectedField: string;
  selectedValue: string;
  styleList: IRule[];
}

class MultipleStyleForm extends BaseStyleForm<IProps, IState> {
  private pointSymbolizerRef = React.createRef<PointSymbolizer>();

  constructor(props: BaseStyleFormProps) {
    super(props);
    this.state = {
      fields: [],
      fieldValues: [],
      selectedField: "",
      selectedValue: "",
      styleList: [
        {
          title: "default",
          style: this.getRandomStyle(),
        },
      ],
    };
  }

  componentDidMount() {
    const currentStyle = this.props.mapVM.getDALayer(this.props.layerId)?.style
      ?.style;
    // console.log(currentStyle)
    if (currentStyle) {
      const styleList = [{ title: "default", style: currentStyle.default }];
      currentStyle.rules?.forEach((rule) => {
        styleList.push(rule);
      });
      this.setState(() => ({ styleList: styleList }));
    }
    this.props.mapVM
      .getApi()
      .get(MapAPIs.DCH_LAYER_FIELDS, { uuid: this.props.layerId })
      .then((payload: any) => {
        // console.log("fields", payload)
        this.setState({ fields: payload });
      });
  }

  getFeatureStyle(): IFeatureStyle {
    // const style: DAGeomStyle = this.vectorStyleRef.current.getStyleParams()
    const defaultRule: IRule[] = this.state.styleList.filter(
      (item: IRule) => item.title === "default"
    );
    const rules: IRule[] = this.state.styleList.filter(
      (item: IRule) => item.title !== "default"
    );
    return {
      type: "multiple",
      style: {
        default: defaultRule[0].style,
        rules: rules,
      },
    };
  }

  getFieldName(fieldInfo: any) {
    this.props.mapVM
      .getApi()
      .get(MapAPIs.DCH_LAYER_FIELD_DISTINCT_VALUE, {
        uuid: this.props.layerId,
        field_name: fieldInfo.name,
        field_type: fieldInfo.d_type,
      })
      .then((payload: any) => this.setState({ fieldValues: payload }));
  }

  getRandomStyle(): IGeomStyle {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return {
      pointShape:
        this.pointSymbolizerRef.current?.getPointSymbolizer().pointShape ||
        "circle",
      pointSize:
        this.pointSymbolizerRef.current?.getPointSymbolizer().pointSize || 10,
      strokeColor: randomColor,
      strokeWidth: 3,
      fillColor: randomColor + "bf",
    };
  }

  updatePointParams(pointSymbolizer: IPointSymbolizerState) {
    const styleList = this.state.styleList.map((rule: IRule) => {
      rule.style.pointShape = pointSymbolizer.pointShape;
      rule.style.pointSize = pointSymbolizer.pointSize;
      return rule;
    });
    this.setState({ styleList: styleList });
  }

  updateStyleItem(index: number, style: IGeomStyle) {
    const data = this.state.styleList.map((item: IRule, i: number) =>
      i == index ? Object.assign(item, { style: style }) : item
    );
    this.setState(() => ({ styleList: data }));
  }

  AddStyleItem() {
    if (!this.state.selectedField || this.state.selectedField == "") {
      this.props.mapVM.showSnackbar("Please select field");
    } else if (!this.state.selectedValue || this.state.selectedValue == "") {
      this.props.mapVM.showSnackbar("Please select value");
    } else {
      const index = this.state.styleList.findIndex(
        (item: IRule) =>
          item.filter?.field === this.state.selectedField &&
          item.filter?.value === this.state.selectedValue
      );
      if (index === -1) {
        const data: IRule[] = [
          ...this.state.styleList,
          {
            title: this.state.selectedValue,
            filter: {
              field: this.state.selectedField,
              op: "==",
              value: this.state.selectedValue,
            },
            style: this.getRandomStyle(),
          },
        ];
        this.setState(() => ({ styleList: data }));
      } else {
        this.props.mapVM.showSnackbar(
          "Value already added. Select other Value..."
        );
      }
    }
  }

  AddAllStyleItem() {
    if (!this.state.selectedField || this.state.selectedField == "") {
      this.props.mapVM.showSnackbar("Please select field");
    } else {
      const styleItems: IRule[] = [];
      this.state.fieldValues.forEach((value: string) => {
        styleItems.push({
          title: value,
          filter: {
            field: this.state.selectedField,
            op: "==",
            value: value,
          },
          style: this.getRandomStyle(),
        });
      });
      styleItems.push({
        title: "default",
        style: this.getRandomStyle(),
      });
      this.setState(() => ({ styleList: styleItems }));
    }
  }

  RemoveAllItems() {
    const defaultValue = this.state.styleList.filter(
      (item: IRule) => item.title === "default"
    );
    this.setState(() => ({ styleList: defaultValue }));
  }

  render() {
    //@ts-ignore
    const geomType = this.props?.mapVM
      ?.getDALayer(this.props?.layerId)
      .getGeomType();
    return (
      <React.Fragment>
        {geomType.findIndex((a) => a.includes("Point")) !== -1 && (
          <PointSymbolizer
            ref={this.pointSymbolizerRef}
            pointSize={this.state.styleList[0].pointSize}
            pointShape={this.state.styleList[0].pointShape}
            updateStyle={this.updatePointParams.bind(this)}
          />
        )}
        <fieldset>
          <legend>Select Field and Value</legend>
          <Box sx={{ flex: 1, pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="select-field-label">Select Field</InputLabel>
              <DASelect
                labelId="select-field-label"
                id="select-field-select"
                value={this.state.selectedField}
                label="Select Field"
                onChange={(e) => {
                  //@ts-ignore
                  this.setState({ selectedField: e.target.value });
                  const fieldInfo = this.state.fields.find(
                    (item: FieldInfo) => item.name === e.target.value
                  );
                  this.getFieldName(fieldInfo);
                }}
              >
                {this.state.fields.map(
                  (field: any) =>
                    field.d_type === "string" && (
                      <MenuItem key={`${field.name}-key`} value={field.name}>
                        {field.name}
                      </MenuItem>
                    )
                )}
              </DASelect>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, pt: 1 }}>
            <FormControl fullWidth size={"small"}>
              <InputLabel id="select-value-label">Select Value</InputLabel>
              <DASelect
                labelId="select-value-label"
                id="select-value-select"
                value={this.state.selectedValue}
                label="Select Value"
                onChange={(e) => {
                  // @ts-ignore
                  this.setState({ selectedValue: e.target.value });
                }}
              >
                {this.state.fieldValues.map((value: any) => (
                  <MenuItem key={`${value}-key`} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </DASelect>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, pt: 1 }}>
            <Button
              onClick={this.AddStyleItem.bind(this)}
              fullWidth={true}
              color={"success"}
              variant={"contained"}
            >
              Add Value
            </Button>
          </Box>
          <Box sx={{ flex: 1, pt: 1 }}>
            <Button
              onClick={this.AddAllStyleItem.bind(this)}
              fullWidth={true}
              color={"primary"}
              variant={"contained"}
            >
              Add All Value
            </Button>
          </Box>
          <Box sx={{ flex: 1, pt: 1 }}>
            <Button
              onClick={this.RemoveAllItems.bind(this)}
              fullWidth={true}
              color={"error"}
              variant={"contained"}
            >
              Clear
            </Button>
          </Box>
        </fieldset>
        {this.state.styleList.length > 0 && (
          <fieldset>
            <legend>Symbology Grid</legend>
            <TableContainer style={{ maxHeight: 200 }}>
              <Table size={"medium"} padding={"none"}>
                <TableBody>
                  {this.state.styleList.map((item: IRule, index: number) => (
                    <TableRow key={"style-row-" + index}>
                      <TableCell key={"style-title-" + index}>
                        {item.title}
                      </TableCell>
                      <TableCell key={"style-icon-cell-" + index}>
                        <LegendIcons
                          key={"Legend-icon-" + index}
                          mapVM={this.props.mapVM}
                          updateStyle={(style: IGeomStyle) =>
                            this.updateStyleItem(index, style)
                          }
                          index={index}
                          geomType={geomType}
                          style={item.style}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </fieldset>
        )}
      </React.Fragment>
    );
  }
}

export default MultipleStyleForm;
