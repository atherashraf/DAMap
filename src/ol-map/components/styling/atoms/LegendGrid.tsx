import * as React from "react";
import {Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import {IBaseMapProps, IRule} from "../../../TypeDeclaration";
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
    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType()
        return (
            <fieldset>
                <legend>{this.props.title || "Legend Grid"}</legend>
                <TableContainer style={{maxHeight: this.props.maxHeight || 200}}>
                    <Table size={"medium"} padding={"none"}>
                        <TableBody>
                            {this.props.styleList.map((item: IRule, index: number) =>
                                <TableRow>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>
                                        <LegendIcons mapVM={this.props.mapVM}
                                                     updateStyle={this.props.updateStyleItem.bind(this)}
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
