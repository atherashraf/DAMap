import * as React from "react";
import {Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField} from "@mui/material";
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

    handleTitleButtonClick(index: number, item: any) {
        const dialogBoxRef = this.props.mapVM.getDialogBoxRef();
        const jsx = (<Box sx={{p: 1}}><Stack spacing={2}>
            <TextField
                key={"item-label-field"}
                label="Label"
                defaultValue={item.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    item["title"] = e.target.value as string
                    this.props.updateStyleItem(index, item)
                }}
            />
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={{xs: 1, sm: 2, md: 4}}
            >
                <TextField
                    key={"item-min-field"}
                    label="min value"
                    defaultValue={item.filter.value[0]}
                />
                <TextField
                    key={"item-max-field"}
                    label="max value"
                    defaultValue={item.filter.value[1]}
                />
            </Stack>
        </Stack></Box>);
        dialogBoxRef?.current?.openDialog({
            title: "Legend Item", content: <div>{jsx}</div>
        })
    }

    render() {
        //@ts-ignore
        const geomType = this.props.mapVM?.getDALayer(this.props?.layerId).getGeomType() || ["Polygon"]
        return (
            <fieldset>
                <legend>{this.props.title || "Legend Grid"}</legend>
                <TableContainer style={{maxHeight: this.props.maxHeight || 200}}>
                    <Table size={"medium"} padding={"none"}>
                        <TableBody>
                            {this.props.styleList.map((item: any, index: number) =>
                                <TableRow key={"legend-row-" + index}>
                                    <TableCell key={"legend-cell-title-" + index}
                                    >{typeof item.title == "string" ?
                                        <Button
                                            onClick={() => this.handleTitleButtonClick(index, item)}>{item.title}</Button> :
                                        <TextField type={"number"} variant={"filled"} onChange={(e: any) => {

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
