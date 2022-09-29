import * as React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";

// const mapVM = new MapVM()
// mapVM.initMap();
// mapVM.setTarget('map');
const root = createRoot(document.getElementById("root") as Element)
root.render(<App />);

