import * as React from "react";

import LayerDesigner from "./ol-map/containers/LayerDesigner";
import {BrowserRouter, createBrowserRouter, HashRouter, Route, Routes, useNavigate} from "react-router-dom";
import LayerInfo from "./admin/containers/LayerInfo";
import MapInfo from "./admin/containers/MapInfo";
import MapAdmin from "./admin/containers/MapAdmin";
import DAMap from "./ol-map/containers/DAMap";
import DASnackbar from "./ol-map/components/common/DASnackbar";
import UserUtils from "./admin/UserUtils";
import {RefObject} from "react";
import DAAppBar from "./DAAppbar";

const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
interface IProps {
    children: JSX.Element
}

const Protected = (props: IProps) => {
    // const isAuthenticated = UserUtils.isLoggedIn()
    const [auth, setAuth] = React.useState<boolean>(false)
    const navigate = useNavigate()
    const {children} = props;
    UserUtils.isLoggedIn().then((r) => {
        // console.log("isLogged in", r)

        if (!r) {
            navigate("/")
            snackbarRef.current.show("Failed to login. " +
                "Please check your credentials")
        }else{
            setAuth(r)
        }

    })

    return (<React.Fragment>{auth ? children :
        <></>}</React.Fragment>)
};
const MapRoutes = () => {
    return (

        <Routes>
            <Route path="/designer/:layerId/" element={<LayerDesigner/>}/>

            <Route path={"/LayerInfo"} element={
                <Protected>
                    <LayerInfo key={"layer-info-key"}/>
                </Protected>
            }/>
            <Route path={"/MapInfo"} element={
                <Protected>
                    <MapInfo key={"map-info-key"}/>
                </Protected>
            }/>
            <Route path={"/ViewMap/:mapId/"} element={<DAMap/>}/>
            <Route path={"/EditMap/:mapId/"} element={<DAMap isEditor={true}/>}/>
            <Route path={"/"} element={<MapAdmin/>}/>
        </Routes>

    )
}

const App = () => {
    const [auth, setAuth] = React.useState<boolean>(null)
    // const [userName, setUserName] = React.useState<string>("")
    // const api = new MapApi(null)


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
        if (event.target.checked) {

        } else {
            UserUtils.removeUser()
        }
    }
    return (
        // <RouterProvider router={router} />
        <React.Fragment>
            <BrowserRouter>
                <DAAppBar snackbarRef={snackbarRef}/>
                <MapRoutes/>
                <DASnackbar ref={snackbarRef}/>
            </BrowserRouter>
        </React.Fragment>
    )
}

export default App
