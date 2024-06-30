import * as React from "react";
import ChangeList, {Action} from "../components/ChangeList";
import DASnackbar from "../../ol-map/components/common/DASnackbar";
import {Column, Row} from "../../widgets/grid/GridTypeDeclaration";
import MapApi, {MapAPIs} from "../../ol-map/utils/MapApi";
import {useNavigate} from "react-router-dom";
import {RefObject} from "react";

const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
const changeListRef = React.createRef<ChangeList>();
const MapInfo = () => {
    const [columns, setColumns] = React.useState<Column[]>([]);
    const [data, setData] = React.useState<Row[]>();
    const [actions, setActions] = React.useState<Action[]>([]);
    const api = React.useMemo(() => new MapApi(snackbarRef), []);

    const navigate = useNavigate();
    const getRowData = React.useCallback(() => {
        return changeListRef.current?.getSelectedRowData();
    },[]);
    const getSelectedUUID = React.useCallback(() => {
        const rowData = getRowData();
        if (rowData) {
            return rowData.uuid;
        }
    }, [getRowData]) ;
    const initAction = React.useCallback(() => {
        const actions = [
            {
                name: "Create Map Info",
                action: () => {
                    navigate("/EditMap/-1");
                },
            },
            {
                name: "View Map",
                action: () => {
                    const uuid = getSelectedUUID();
                    if (uuid) {
                        navigate("/ViewMap/" + uuid);
                    } else {
                        snackbarRef.current?.show("Please select a row");
                    }
                },
            },
            {
                name: "Update Map",
                action: () => {
                    const uuid = getSelectedUUID();
                    if (uuid) {
                        navigate("/EditMap/" + uuid);
                        // api.get(MapAPIs.DCH_UPDATE_MAP, { uuid: uuid }).then((payload) => {
                        //   if (payload) {
                        //     window.location.reload();
                        //     setTimeout(() => {
                        //       snackbarRef.current?.show("Map Info updated successfully");
                        //     }, 3000);
                        //   }
                        // });
                    } else {
                        snackbarRef.current?.show("Please select a row");
                    }
                },
            },
            {
                name: "Delete Map",
                action: () => {
                    const uuid = getSelectedUUID();
                    if (uuid) {
                        api.get(MapAPIs.DCH_DELETE_MAP, {uuid: uuid}).then((payload) => {
                            if (payload) {
                                window.location.reload();
                                setTimeout(() => {
                                    snackbarRef.current?.show("Map Info deleted successfully");
                                }, 3000);
                            }
                        });
                    } else {
                        snackbarRef.current?.show("Please select a row");
                    }
                },
            },
        ];
        setActions(actions);
    }, [navigate, api, getSelectedUUID]);
    React.useEffect(() => {
        initAction();
        api.get(MapAPIs.DCH_ALL_MAP_INFO).then((payload) => {
            if (payload) {
                setColumns(payload.columns);
                setData(payload.rows);
            }
        });
    }, [api, initAction]);

    return (
        <React.Fragment>
            {/*<Typography variant="h5">Map Info</Typography>*/}
            {columns.length > 0 ? (
                //@ts-ignore
                <ChangeList
                    ref={changeListRef}
                    columns={columns}
                    data={data || []}
                    tableHeight={"100%"}
                    tableWidth={"100%"}
                    actions={actions}
                    api={api}
                    modelName={"MapInfo"}
                    pkColName={"uuid"}
                />
            ) : (
                <React.Fragment/>
            )}
            <DASnackbar ref={snackbarRef}/>
        </React.Fragment>
    );
};

export default MapInfo;
