import * as React from "react";
import {createRoot} from "react-dom/client";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import App from "./App";


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
const isMap = (elem.getAttribute("isMap") == 'true')
const isDesigner = (elem.getAttribute("isDesigner") == 'true')
const root = createRoot(elem)





root.render(<ThemeProvider theme={theme}>
    <App uuid={uuid} isMap={isMap} isDesigner={isDesigner}/>
</ThemeProvider>);

