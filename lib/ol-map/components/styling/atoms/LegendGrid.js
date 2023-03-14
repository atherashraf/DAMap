import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { LegendIcons } from "./LegendIcons";
export default class LegendGrid extends React.PureComponent {
    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType();
        return (React.createElement("fieldset", null,
            React.createElement("legend", null, this.props.title || "Legend Grid"),
            React.createElement(TableContainer, { style: { maxHeight: this.props.maxHeight || 200 } },
                React.createElement(Table, { size: "medium", padding: "none" },
                    React.createElement(TableBody, null, this.props.styleList.map((item, index) => React.createElement(TableRow, null,
                        React.createElement(TableCell, null, item.title),
                        React.createElement(TableCell, null,
                            React.createElement(LegendIcons, { mapVM: this.props.mapVM, updateStyle: this.props.updateStyleItem.bind(this), index: index, geomType: geomType, style: item.style })))))))));
    }
}
