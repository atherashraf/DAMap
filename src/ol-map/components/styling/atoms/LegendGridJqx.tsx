import JqxGrid, {
  IGridProps,
  jqx,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import * as React from "react";
import LegendGridJqxToolbar from "./LegendGridJqxToolbar";
import { createRoot } from "react-dom/client";
import JqxDropDownButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownbutton";
import JqxColorPicker from "jqwidgets-scripts/jqwidgets-react-tsx/jqxcolorpicker";

class LegendGridJqx extends React.PureComponent<{}, IGridProps> {
  private myGrid = React.createRef<JqxGrid>();
  private gridToolbar = new LegendGridJqxToolbar(this.myGrid);

  constructor(props: {}) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      source: this.getAdapter(),
      rendertoolbar: this.gridToolbar.renderToolbar,
    };
  }

  private getColumns(): IGridProps["columns"] {
    // @ts-ignore
    return [
      {
        text: "Class Label",
        datafield: "label",
        columntype: "textbox",
        width: "30%",
      },
      {
        text: "Min Value",
        datafield: "min_val",
        columntype: "numberinput",
        width: "20%",
        align: "center",
        cellsalign: "center",
        cellsformat: "f",
        //@ts-ignore
        createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ digits: 3 });
        },
        // validation: (cell: any, value: number): any => {
        //     if (value < 0 || value > 15) {
        //         return {result: false, message: 'Price should be in the 0-15 interval'};
        //     }
        //     return true;
        // }
      },
      {
        text: "Max Value",
        datafield: "max_val",
        columntype: "numberinput",
        width: "20%",
        align: "center",
        cellsalign: "center",
        cellsformat: "f",
        //@ts-ignore
        createeditor: (row: number, cellvalue: any, editor: any): void => {
          editor.jqxNumberInput({ digits: 3 });
        },
        // validation: (cell: any, value: number): any => {
        //     if (value < 0 || value > 15) {
        //         return {result: false, message: 'Price should be in the 0-15 interval'};
        //     }
        //     return true;
        // }
      },
      {
        text: "Color",
        datafield: "color",
        columntype: "custom",
        width: "30%",
        align: "center",
        cellsalign: "center",
        cellsformat: "d",
        //@ts-ignore
        createeditor: (row, cellValue: any, editor) => {
          const editorRoot = createRoot(editor[0]);
          const myDropDown = React.createRef<JqxDropDownButton>();
          editorRoot.render(
            // @ts-ignore
            <JqxDropDownButton
              ref={myDropDown}
              style={{ margin: "3px", float: "left" }}
              width={150}
              height={22}
            >
              <div style={{ padding: "3px" }}>
                <JqxColorPicker
                  onColorchange={(event: any): void => {
                    const value = "#" + event?.args?.color.hex;
                    editor[0].style.backgroundColor =
                      "#" + event?.args?.color.hex;
                    editor[0].innerHTML = "#" + event?.args?.color.hex;
                    // cellValue = '#' + event?.args?.color.hex;
                    this.myGrid.current?.setcellvalue(
                      row,
                      "color",
                      "#" + event?.args?.color.hex
                    );
                    // var rowID = $('#jqxgrid').jqxGrid('getrowid', editrow);
                    const rowData = this.myGrid?.current?.getrowdata(row);
                    console.log("reow data", rowData);
                    rowData.color = value;
                    this.myGrid?.current?.updaterow(row, rowData);
                    // this.myGrid.current.
                    this.myGrid?.current?.savestate();
                  }}
                  width={220}
                  height={220}
                  colorMode={"hue"}
                />
              </div>
            </JqxDropDownButton>
          );
        },
        //@ts-ignore
        cellsrenderer: (
          //@ts-ignore
          row: number,
          //@ts-ignore
          columnfield: string,
          value: any,
          //@ts-ignore
          defaulthtml: string,
          columnproperties: any
        ) => {
          // return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #0000ff;">' + value + '</span>';
          return `<div style="width:100%; height:100%;background-color: ${value};float: ${columnproperties.cellsalign}">${value}</div>`;
        },
      },
    ];
  }

  private getAdapter() {
    const source: any = {
      datafields: [
        { name: "label", type: "string" },
        { name: "min_val", type: "number" },
        { name: "max_val", type: "number" },
        { name: "color", type: "string" },
      ],
      datatype: "array",
      // localdata: generatedata(200, false)
      localdata: [
        // {"label": "add name", "min_val": 0, "max_val": 0, "color": "#000"},
        // {"label": "add name", "min_val": 0, "max_val": 0, "color": "#000"},
        // {"label": "add name", "min_val": 0, "max_val": 0, "color": "#000"}
      ],
    };
    return new jqx.dataAdapter(source);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.gridToolbar.createButtons();
    }, 1000);
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <JqxGrid
          ref={this.myGrid}
          // @ts-ignore
          width={600}
          source={this.state.source}
          columns={this.state.columns}
          editable={true}
          editmode={"selectedrow"}
          selectionmode={"singlerow"}
          showtoolbar={true}
          rendertoolbar={this.state.rendertoolbar}
        />
        <div
          style={{ fontSize: "12px", fontFamily: "Verdana", marginTop: "30px" }}
        >
          Double click on the row for editing...
        </div>
      </div>
    );
  }
}

export default LegendGridJqx;
