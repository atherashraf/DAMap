import * as React from "react";
import JqxGrid, {IGridProps, jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import {Column, Row} from "../data-grid/TypeDeclaration";
import MapVM from "../ol-map/models/MapVM";

interface DataGridProps {
    columns: Column[];
    data: Row[];
    title: string
    tableHeight: number,
    tableWidth: number | 'auto'
    mapVM: MapVM
}

class DAGrid extends React.PureComponent<DataGridProps, IGridProps> {
    constructor(props: DataGridProps) {
        super(props);
        console.log("grid props", props);
        // const source: any = {
        //     url: 'https://www.jqwidgets.com/react/sampledata/products.xml?filterscount=0&groupscount=0&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10&_=1679078730633',
        //     datafields: [
        //         {name: 'ProductName', type: 'string'},
        //         {name: 'QuantityPerUnit', type: 'int'},
        //         {name: 'UnitPrice', type: 'float'},
        //         {name: 'UnitsInStock', type: 'float'},
        //         {name: 'Discontinued', type: 'bool'}
        //     ],
        //     datatype: 'xml',
        //     id: 'ProductID',
        //     record: 'Product',
        //     root: 'Products',
        // };
        const source: any = {
            datatype: "array",
            localdata: this.props.data
        }
        const columns = [];
        let totalWidth = 0
        props.columns.forEach((col) => {
            const width = col.type == "string" ? 200 : 80
            columns.push({
                text: col.label,
                aligh: col.type == "string" ? "left" : "center",
                datafield: col.id,
                width: width,
            })
            totalWidth += width;
        })

        console.log("columns", columns, totalWidth)
        this.state = {
            width: "100%",
            height: this.props.tableHeight + "px",
            columns: columns,
            source: new jqx.dataAdapter(source)
        }
    }


    render() {
        return (
            <React.Fragment>
                <JqxGrid
                    // @ts-ignore
                    width={this.state.width} source={this.state.source} columns={this.state.columns}
                    height={this.state.height}
                    scrollmode={"default"}
                    altrows={true}/>
            </React.Fragment>
        )
    }
}

export default DAGrid
