import React from "react";
import {Box, FormControl, InputLabel, MenuItem, TextField} from "@mui/material";
import {DASelect} from "../../../StyledMapComponent";
import {Style, Icon} from "ol/style";
import {IGeomStyle} from "../../../../TypeDeclaration";
import _ from "../../../../utils/lodash";
import {renderToStaticMarkup} from "react-dom/server";


const minPointSize = 9, maxPointSize = 25
export const pointShapeTypes = [
    'circle',
    'star',
    'triangle',
    'square',
    // 'stacked',
] as const

export const getPointSVG = (style: IGeomStyle, w: number = maxPointSize * 2 + 1, h: number = maxPointSize + 1): JSX.Element => {
    const svgStyle = {
        fill: style.fillColor,
        strokeWidth: style.strokeWidth,
        stroke: style.strokeColor
    }

    const size = maxPointSize; //style.pointSize
    const ratio = (maxPointSize - minPointSize) / (style.pointSize - minPointSize)
    // const startPoint = [(w / 2 - size), (h - size)]
    let svgShape;
    switch (style.pointShape) {
        case "star":
            svgShape = <path
                d="M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z"
                style={svgStyle}/>
            break;
        case "square":
            svgShape = <rect x={(w - size) / 2} y={(h - size) / 2} width={size} height={size}
                             style={svgStyle}/>
            break;
        case "triangle":
            const startPoint = [minPointSize, h] //[(w / 2 - size), (h - size)]
            const apex = [w / 2, 0]    //[startPoint[0] + size / 2, startPoint[1] - size]
            const endPoint = [w - minPointSize, h] //[startPoint[0] + size, startPoint[1]]
            const d = `M${startPoint.join(" ")} L${apex.join(" ")}
            L${endPoint.join(" ")} Z`
            // return <polygon points={`${String(startPoint)} ${String(apex)} ${String(endPoint)}`}
            //                 style={svgStyle}/>
            svgShape = <path d={d} style={svgStyle}/>
            break;
        default:
            svgShape = <circle cx={w / 2} cy={h / 2} r={size / 2}
                               style={svgStyle}>
            </circle>
            // svgShape=<circle cx={250} cy={250} r={200} style={svgStyle}/>
            break;
    }
    // const red = maxPointSize - style.pointSize
    const red = 0 //(maxPointSize - style.pointSize)/2
    return <svg role="img" width={w} height={h}
                     viewBox={`${red} ${red} ${(w - red) * ratio} ${(h - red) * ratio}`}
                     xmlns="http://www.w3.org/2000/svg">
        {svgShape} </svg>
}
export const getPointShapes = (style: IGeomStyle): Style => {
    const svgElem = getPointSVG(style)
    const svg = renderToStaticMarkup(svgElem)
    // console.log("svg", svg);
    return new Style({
        image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(svg)
        })
    })

}

interface IProps {
    updateStyle?: Function
    pointShape: typeof pointShapeTypes[number]
    pointSize: number
}

export interface IPointSymbolizerState {
    pointShape: typeof pointShapeTypes[number]
    pointSize: number
}

class PointSymbolizer extends React.PureComponent<IProps, IPointSymbolizerState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pointShape: this.props.pointShape || "circle",
            pointSize: this.props.pointSize || 18
        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IPointSymbolizerState>, snapshot?: any) {
        if (this.props.pointShape != prevProps.pointShape) {
            this.setState({pointShape: this.props.pointShape})
        }
        if (this.props.pointSize != prevProps.pointSize) {
            this.setState({pointSize: this.props.pointSize})
        }
        if (!_.isEqual(prevState, this.state) && this.props.updateStyle) {
            this.props.updateStyle({...this.state})
        }
    }

    getPointSymbolizer() {
        return {...this.state}
    }

    render() {
        return (
            <React.Fragment>
                <fieldset>
                    <legend>Point Symbol</legend>
                    <Box sx={{flex: 1, pt: 1}}>
                        <FormControl fullWidth size={"small"}>
                            <InputLabel id="select-value-label">Select Point Shape</InputLabel>
                            <DASelect
                                value={this.state.pointShape}
                                label="Select Point Shape"
                                onChange={(e) => {
                                    // @ts-ignore
                                    this.setState({pointShape: e.target.value as string})
                                }}
                            >
                                {pointShapeTypes.map((value: any) =>
                                    <MenuItem key={`${value}-key`} value={value}>{value}</MenuItem>)}
                            </DASelect>
                        </FormControl>
                    </Box>
                    <Box sx={{flex: 1, pt: 1}}>
                        <FormControl fullWidth size={"small"}>
                            {/*<InputLabel id="select-value-label">Select Point Size</InputLabel>*/}
                            <TextField type={"number"} value={this.state.pointSize}
                                       label="Select Point Size"
                                       size={"small"}
                                       onChange={(e) =>
                                           this.setState({pointSize: parseInt(e.target.value as string)})}
                                       InputProps={{inputProps: {min: minPointSize + 1, max: maxPointSize}}}/>
                        </FormControl>
                    </Box>
                </fieldset>
            </React.Fragment>
        )
    }
}

export default PointSymbolizer
