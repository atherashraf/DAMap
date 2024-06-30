import * as React from "react";
import { Column, Row } from "../../widgets/grid/GridTypeDeclaration";
import ChangeList, { Action } from "../components/ChangeList";
import MapApi, { MapAPIs } from "../../ol-map/utils/MapApi";
import DASnackbar from "../../ol-map/components/common/DASnackbar";
import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import DAFullScreenDialog from "../../ol-map/components/common/DAFullScreenDialog";
import AddRasterLayerInfo from "../components/forms/AddRasterLayerInfo";
import AddVectorLayerInfo from "../components/forms/AddVectorLayerInfo";
import AddURLLayerInfo from "../components/forms/AddURLLayerInfo";

const changeListRef = React.createRef<ChangeList>();
const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
const dialogRef: RefObject<DAFullScreenDialog> = React.createRef<DAFullScreenDialog>();

const LayerInfo = () => {
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [data, setData] = React.useState<Row[]>();
  const [actions, setActions] = React.useState<Action[]>([]);
  const navigate = useNavigate();

  const api = React.useMemo(() => new MapApi(snackbarRef), []);

  const getTableData = React.useCallback(() => {
    api.get(MapAPIs.DCH_ALL_LAYER_INFO).then((payload) => {
      if (payload) {
        setData(payload.rows);
        setColumns(payload.columns);
      }
    });
  }, [api]);

  const getSelectedRowData = React.useCallback(() => {
    const rowData = changeListRef.current?.getSelectedRowData();
    return rowData;
  }, []);

  const getSelectedUUID = React.useCallback(() => {
    const rowData = getSelectedRowData();
    if (rowData) {
      return rowData.uuid;
    }
  }, [getSelectedRowData]);

  const initActions = React.useCallback(() => {
    const actions: Action[] = [
      {
        name: "View Layer Designer",
        action: () => {
          const uuid = getSelectedUUID();
          navigate("/designer/" + uuid);
        },
      },
      {
        name: "Add Raster Layer",
        action: () => {
          dialogRef.current?.handleClickOpen();
          dialogRef.current?.setContent(
              "Add Raster Layer",
              <AddRasterLayerInfo
                  dialogRef={dialogRef}
                  snackbarRef={snackbarRef}
              />
          );
        },
      },
      {
        name: "Add Vector Layer",
        action: () => {
          dialogRef.current?.handleClickOpen();
          dialogRef.current?.setContent(
              "Add Vector Layer",
              <AddVectorLayerInfo
                  dialogRef={dialogRef}
                  snackbarRef={snackbarRef}
              />
          );
        },
      },
      {
        name: "Add Layer URL",
        action: () => {
          dialogRef.current?.handleClickOpen();
          dialogRef.current?.setContent(
              "Add Layer URL",
              <AddURLLayerInfo dialogRef={dialogRef} snackbarRef={snackbarRef} />
          );
        },
      },
      {
        name: "Update Layer Info",
        action: () => {
          const rowData = getSelectedRowData();
          //@ts-ignore
          const id = rowData["id"];
          const url = MapApi.getURL(MapAPIs.DCH_ADMIN_LAYER_INFO_EDIT, {
            id: id,
          });
          //@ts-ignore
          window?.open(url, "MapAdmin").focus();
        },
      },
      {
        name: "Delete layer Info",
        action: () => {
          const uuid = getSelectedUUID();
          if (uuid) {
            api
                .get(MapAPIs.DCH_DELETE_LAYER_INFO, { uuid: uuid })
                .then((payload) => {
                  if (payload) {
                    window.location.reload();
                    snackbarRef?.current?.show("Layer info deleted successfully");
                  }
                });
          } else {
            snackbarRef?.current?.show("Please select row to delete");
          }
        },
      },
      {
        name: "Download SLD",
        action: () => {
          const uuid = getSelectedUUID();
          if (uuid) {
            const url = MapApi.getURL(MapAPIs.DCH_DOWNLOAD_SLD, { uuid: uuid });
            window.open(url);
          }
        },
      },
    ];
    setActions(actions);
  }, [getSelectedUUID, navigate, api, getSelectedRowData]);

  React.useEffect(() => {
    initActions();
    getTableData();
  }, [getTableData, initActions]);

  return (
      <React.Fragment>
        {columns.length > 0 ? (
            //@ts-ignore
            <ChangeList
                ref={changeListRef}
                columns={columns}
                data={data || []}
                tableHeight={"100%"}
                tableWidth={"100%"}
                modelName={"LayerInfo"}
                actions={actions}
                api={api}
                pkColName={"uuid"}
            />
        ) : (
            <React.Fragment />
        )}
        <DASnackbar ref={snackbarRef} />
        <DAFullScreenDialog ref={dialogRef} />
      </React.Fragment>
  );
};

export default LayerInfo;
