import * as React from "react";
import { RefObject } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, IconButton } from "@mui/material";
import { IBaseMapProps } from "../../../TypeDeclaration";
import DADialogBox from "../../common/DADialogBox";
import DAColorPicker from "../DAColorPicker";
import _ from "../../../utils/lodash";

interface IProps extends IBaseMapProps {}

interface IState {
  backgroundColor: string;
  colors: string[];
}

class ColorRamp extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      backgroundColor: "linear-gradient(to right, white 0%, darkblue 100%)",
      // colors: ["#e9e9ea", "#040471"],
      colors: ["#701d1d", "#dcdf95", "#094018"],
    };
  }

  componentDidMount() {
    this.createColorRamp();
  }

  getColors() {
    return [...this.state.colors];
  }

  getColor(noOfClasses: number, valueIndex = -1): string {
    if (valueIndex === -1) {
      return _.randomColor();
    } else {
      // const valueNormalizedIndex = valueIndex / (this.state.noOfClasses - 1);
      const colors = this.getColors();

      const index = (valueIndex / (noOfClasses - 1)) * (colors.length - 1);
      const mod = index % (colors.length - 1);
      // console.log("normalized values", valueNormalizedIndex, mod)
      let c;
      if (mod === 0) {
        c = colors[index];
      } else {
        const f = Math.floor(index);
        const x1 = (f / (colors.length - 1)) * (noOfClasses - 1);
        const x2 = ((f + 1) / (colors.length - 1)) * (noOfClasses - 1);
        const rgba1 = _.hex2rgba(colors[f]);
        const rgba2 = _.hex2rgba(colors[f + 1]);
        const r: string = Math.round(
          //@ts-ignore
          _.linearInterpolation(valueIndex, [x1, rgba1?.r], [x2, rgba2?.r])
        ).toString(16);
        const g: string = Math.round(
          //@ts-ignore
          _.linearInterpolation(valueIndex, [x1, rgba1?.g], [x2, rgba2?.g])
        ).toString(16);
        const b: string = Math.round(
          //@ts-ignore
          _.linearInterpolation(valueIndex, [x1, rgba1?.b], [x2, rgba2?.b])
        ).toString(16);
        const a: string = Math.round(
          //@ts-ignore
          _.linearInterpolation(valueIndex, [x1, rgba1?.a], [x2, rgba2?.a])
        ).toString(16);
        c = `#${r}${g}${b}${a}`;
        // console.log("color", {
        //     "value Index": valueIndex, "color index": index,
        //     "x1": x1, "x2": x2, "y1": f, "y2": f + 1,
        //     "c": c, "c1": colors[f], "c2": colors[f + 1]
        // })
      }

      return c;
    }
  }

  createColorRamp() {
    // colors = colors ? colors : this.state.colors;
    const { colors } = this.state;
    let backgroundColor: string = "linear-gradient(to right";
    const totalColors = this.state.colors.length;
    colors.forEach((c, index) => {
      const percent = (index / (totalColors - 1)) * 100;
      backgroundColor += `, ${c} ${percent}%`;
    });
    backgroundColor += ")";
    this.setState(() => ({ backgroundColor: backgroundColor }));
    this.props.mapVM.getDialogBoxRef().current?.closeDialog();
  }

  async addColor() {
    const newColor = _.randomColor();
    await this.setState(() => ({ colors: [...this.state.colors, newColor] }));
    this.props.mapVM
      .getDialogBoxRef()
      .current?.updateContents(this.getDialogContent());
  }

  handleColorChange(index: number, color: string) {
    const colors = [...this.state.colors];
    colors[index] = color;
    this.setState(() => ({ colors: colors }));
  }

  getDialogContent(): JSX.Element {
    return (
      <React.Fragment>
        <Box sx={{ flex: 1, p: 2, overflowY: "auto", width: 300 }}>
          {this.state.colors.map((c: string, index: number) => (
            <DAColorPicker
              key={"color-" + index}
              onChange={(color: string) => this.handleColorChange(index, color)}
              label={"Color " + index}
              color={c}
              isAlpha={true}
            />
          ))}
        </Box>
      </React.Fragment>
    );
  }

  handleClick() {
    const dialogRef: RefObject<DADialogBox> =
      this.props.mapVM.getDialogBoxRef();
    dialogRef.current?.openDialog({
      title: "Create Color Ramp",
      content: this.getDialogContent(),
      actions: (
        <React.Fragment>
          <Button key={"add-color"} onClick={this.addColor.bind(this)}>
            Add Color
          </Button>
          <Button key={"create-ramp"} onClick={this.createColorRamp.bind(this)}>
            Create{" "}
          </Button>
          {/*<Button key={"close-ramp"} onClick={dialogRef.current?.closeDialog}>Close </Button>*/}
        </React.Fragment>
      ),
    });
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Box
            // onClick={handleClick}
            // endIcon={<KeyboardArrowDownIcon/>}
            // color={"secondary"}
            // fullWidth={true}
            style={{
              background: this.state.backgroundColor,
              width: "85%",
              height: "30px",
            }}
          />
          <IconButton
            style={{ width: "15%", height: 30 }}
            onClick={this.handleClick.bind(this)}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
          {/*Test*/}
        </div>
      </React.Fragment>
    );
  }
}

export default ColorRamp;
