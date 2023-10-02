# Digital Arz Map

A react component for visualizing and analysis data from DigitalArzNode Developed on top of Openlayers.

after installation using npm i damap create .env file and add following lines

```angular2html
REACT_APP_MAP_URL="http://127.0.0.1:8887"
REACT_APP_OPENWEATHER_KEY=***************
REACT_APP_BING_KEY=**************

```

To add a Map panel on any page use following component

```angular2html
import MapComponent from "damap/lib/ol-map/containers/MapComponent"
const mapRef = React.createRef()
const mapUUID ="........."
<MapComponent ref={mapViewRef} uuid={mapUUID} title='Flood Forecast'>
    <button>Test</button>
</MapComponent>
```

where

    uuid is unique identifier for getting Map from DigitalArzNode

## Map View Model

To get Map View Model use

```angular2html
        const mapVM = mapRef.current?.getMapVM();
```    

This View Model can be used for calling different functionalities like
To add Digital Arz MVT Layer use

    mapVM.addDALayer({uuid: selectedOption})

where

    uuid is a Layer info uuid

To open Layer Switcher use

    setTimout(()=>mapVM.openLayerSwitcher(),3000)

it better to use setTimout so layout get adjust before open layer switcher

To open Attribute table use

    openAttributeTable(columns: Column[], rows: Row[], pkCols: string[], tableHeight: number = 300, daGridRef: RefObject, pivotTableSrc:string=null)

where

    columns are of format
    {
        disablePadding: boolean;
        id: string;
        label: string;
        // isNumeric: boolean;
        type: "string" | "number" | "date"
    }

    rows are of format
    {
        rowId: number
        [key: string]: any
    }

    pkCols are an array of primary key column id
    tableHeight ref to the height of the table
    daGridRef is React RefObject to have control on AttributeGrid functions and
    pivotTableSrc is the url of data for pivot Table if data is separate from the table data i.e. rows

## Attribute Table

### JqxGrid

using openAttributeTable and passing daGridRef you can access JqxGrid

    const gridRef = daGridRef?.current?.getJqxGridRef()

you can use all the function mentioned in following Api
Reference https://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/defaultfunctionality.htm
like

    gridRef?.current?.pinColumns(['division'])

### Grid Toolbar

Toolbar can access using

    const toolbarRef = daGridRef?.current?.getToolbarRef()

we can add Button on toolbar using following function

    addButton(newButton: IToolbarButton[])
    where IToolbarButton is 
    {
        id: string
        title: string
        onClick: (e?: Event) => void
        imgSrc: any
    }

example

    const zoomBtn = require("../../static/img/search.png")
    toolbarRef.addButton([{
        id: "zoomButton",
        title: "Zoom To Selection",
        imgSrc: zoomBtn,
        onClick: (e) => {
            mapVM.selectionLayer.zoomToSelection()
        }
    }])

we can add any other Element on toolbar using

    const elem = <>
                <select>
                    <option>1</option>
                    <option>2</option>
                </select></>
    toolbarRef?.current?.addToolbarElements(elem);

## Map Admin

for Managing Layer in DigitalArz Node use following component

```angular2html
import LayerInfo from "damap/lib/admin/containers/LayerInfo"
<LayerInfo/>
```

for Managing Map in DigitalArzNode

```angular2html
import LayerInfo from "damap/lib/admin/containers/MapInfo"
<MapInfo/>
```

author : Ather Ashraf
