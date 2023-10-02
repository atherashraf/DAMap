import * as React from "react";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";

import { createRoot } from "react-dom/client";
import autoBind from "auto-bind";
// const reloadBtn = require("./img/refresh.png");
// const zoomBtn = require("./img/search.png")

class LegendGridJqxToolbar {
  private myGrid: any; //React.RefObject<DAGrid>
  public buttons = [
    {
      id: "addButton",
      value: "Add",
      onClick: this.addButtonOnClick.bind(this),
    },
    {
      id: "deleteButton",
      value: "Delete",
      onClick: this.deleteButtonOnClick.bind(this),
    },
  ];
  constructor(myGrid: any) {
    this.myGrid = myGrid;
    autoBind(this);
  }

  createButtons(): void {
    const btnProps = {
      width: 80,
      height: 25,
      imgPosition: "center",
      textPosition: "center",
    };
    this.buttons.forEach((item) => {
      //@ts-ignore
      const renderer = createRoot(document?.getElementById(item.id));
      renderer.render(
        <JqxButton
          onClick={() => {
            item.onClick();
          }}
          width={btnProps.width}
          height={btnProps.height}
          value={item.value}
        />
      );
    });
  }

  addButtonOnClick() {
    const datarow = {
      label: "add name",
      min_val: 0,
      max_val: 0,
      color: "#000",
    };
    this.myGrid.current?.addrow(null, datarow);
  }
  deleteButtonOnClick() {
    // alert("delete working...")
    const selectedrowindex = this.myGrid.current!.getselectedrowindex();
    const id = this.myGrid.current!.getrowid(selectedrowindex);
    this.myGrid.current!.deleterow(id);
  }

  renderToolbar(toolbar: any) {
    const style: React.CSSProperties = { float: "left", marginLeft: "5px" };
    const buttonsContainer = (
      <div style={{ overflow: "hidden", position: "relative", margin: "5px" }}>
        {this.buttons.map((item) => (
          <div id={item?.id} key={item.id} style={style} />
        ))}
      </div>
    );
    const toolbarRenderer = createRoot(toolbar[0]);
    toolbarRenderer.render(buttonsContainer);
  }
}

export default LegendGridJqxToolbar;
