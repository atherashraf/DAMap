import * as React from "react";

import LayerDesigner from "./ol-map/containers/LayerDesigner";
import {createTheme, ThemeProvider, styled} from '@mui/material/styles';
import {orange} from '@mui/material/colors';


const theme = createTheme({
    // @ts-ignore
    status: {danger: orange[500],},
    palette: {
        primary: {
            main: '#234184'
        },
        secondary: {
            main: '#800000'
        }
    }

});

const App = () => {

    return (
        <ThemeProvider theme={theme}>
            <LayerDesigner layerId={"5426e7d4-2ec9-11ed-98a5-acde48001122"}/>
        </ThemeProvider>
    );
}
export default App;
