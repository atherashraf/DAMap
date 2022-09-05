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
            <LayerDesigner layerId={"d7071f20-269a-11ed-a591-367dda4cf16d"}/>
        </ThemeProvider>
    );
}
export default App;
