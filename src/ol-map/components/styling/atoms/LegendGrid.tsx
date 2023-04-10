import * as React from "react";
import {Table, TableBody, TableCell, TableContainer, TableRow, TextField} from "@mui/material";
import {IBaseMapProps, IGeomStyle, IRule} from "../../../TypeDeclaration";
import {LegendIcons} from "./LegendIcons";


interface IProps extends IBaseMapProps {
    styleList: IRule[]
    updateStyleItem: Function
    maxHeight?: number
    title?: string
}

interface IState {

}

export default class LegendGrid extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

    }

    // getStyleItems() {
    //     return this.state.styleList
    // }

    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType() || ["Polygon"]
        return (
            <fieldset>
                <legend>{this.props.title || "Legend Grid"}</legend>
                <TableContainer style={{maxHeight: this.props.maxHeight || 200}}>
                    <Table size={"medium"} padding={"none"}>
                        <TableBody>
                            {this.props.styleList.map((item: any, index: number) =>
                                <TableRow key={"legend-row-" + index}>
                                    <TableCell key={"legend-cell-title-" + index}
                                    >{typeof item.title == "string" ? item.title :
                                        <TextField type={"number"} variant={"filled"} onChange={(e: any) => {
                                            // item.title=e.target.value
                                            console.log(e.target.value)
                                            item.title = e.target.value as string
                                            this.props.updateStyleItem(index, item)
                                        }} value={item.title}/>
                                    }
                                    </TableCell>
                                    <TableCell key={"legend-cell-icon-" + index}>
                                        <LegendIcons key={"legend-icon-" + index} mapVM={this.props.mapVM}
                                                     updateStyle={(style: IGeomStyle) => {
                                                         item.style = style
                                                         this.props.updateStyleItem(index, style)
                                                     }}
                                                     index={index}
                                                     geomType={geomType}
                                                     style={item.style}/>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </fieldset>
        )
    }
}
