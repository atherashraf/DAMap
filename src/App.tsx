import * as React from "react";

import LayerDesigner from "./ol-map/containers/LayerDesigner";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {orange} from '@mui/material/colors';
import MapView from "./ol-map/containers/MapView";


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
            {/*<LayerDesigner layerId={"77635fc0-354a-11ed-82a7-acde48001122"}/>*/}
            {/*<LayerDesigner layerId={"f7de6208-3612-11ed-87df-acde48001122"} />*/}
            <MapView uuid={	"3250b4e4-3f88-11ed-8ef1-acde48001122"} isMap={false} isDesigner={true}/>
        </ThemeProvider>
    );
}
export default App;
