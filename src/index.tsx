import * as React from "react";
import {createRoot} from "react-dom/client";
import MapView from "./ol-map/containers/MapView";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import DAGrid from "./widgets/grid";

const theme = createTheme({
    // status: {danger: orange[500],},
    // @ts-ignore
    palette: {
        primary: {
            main: '#234184'
        },
        secondary: {
            main: '#800000'
        }
    }

});
const elem = document.getElementById("da-map") as Element;
const uuid = elem.getAttribute("uuid")
const isMap = (elem.getAttribute("isMap") =='true')
const isDesigner = (elem.getAttribute("isDesigner")=='true')
const root = createRoot(elem)


root.render(<ThemeProvider theme={theme}>
    <MapView uuid={uuid} isMap={isMap} isDesigner={isDesigner}/>
    {/*<DAGrid />*/}
</ThemeProvider>);

