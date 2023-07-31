import {Box, Button, MenuItem} from "@mui/material";
import * as React from "react";
import DASnackbar from "../../../ol-map/components/common/DASnackbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MapApi, {MapAPIs} from "../../../ol-map/utils/MapApi";
import LayerCategoryControl, {ILayerCategory} from "./LayerCategoryControl";
import {useState} from "react";
import AddLayerCategoryForm from "./AddLayerCategoryForm";

interface IDBConnection {
    id: number
    name: string
}

interface IProps {
    snackbarRef: React.RefObject<DASnackbar>
}

const PostGISInfo = (props: IProps) => {
    const [formType, setFormType] = useState<"LayerCategory" | null>(null)
    const [selectedDBId, setSelectedDBId] = React.useState<string>(null);
    const [dbConnections, setDBConnections] = React.useState<IDBConnection[]>([])
    const [selectedTable, setSelectedTable] = React.useState<string>(null)
    const [tableList, setTableList] = React.useState<string[]>([])
    const [layerCategory, setLayerCategory] = React.useState<ILayerCategory>()
    const mapApi = new MapApi(props.snackbarRef);
    React.useEffect(() => {
        mapApi.get(MapAPIs.DCH_DB_CONNECTION).then((payload) => {
            if (payload) {
                setDBConnections(payload)
            }
        });
    }, [])
    const handleDBChange = (event: SelectChangeEvent) => {
        const dbId = event.target.value as string
        setSelectedDBId(dbId);
        mapApi.get(MapAPIs.DCH_DB_TABLE_LIST, {db_id: dbId}).then((payload) => {
            if (payload) {
                setTableList(payload)
            }
        })
    };
    const handleTableChange = (event: SelectChangeEvent) => {
        setSelectedTable(event.target.value as string)
    }
    const getForm = () => {
        switch (formType) {
            case "LayerCategory":
                return <AddLayerCategoryForm key={"LayerCategoryFormKey"} snackbarRef={props.snackbarRef} handleBack={
                    () => {
                        setFormType(null)
                    }}/>
        }
    }
    const handleAddLayerInfo = () => {
        mapApi.get(MapAPIs.DCH_SAVE_DB_LAYER_INFO,
            {db_id: selectedDBId, table_name: selectedTable, layer_category_id: layerCategory.pk}).then((payload) => {
            if (payload) {
                props.snackbarRef.current?.show(payload.msg)
            }
        })
    }
    return (
        <React.Fragment>
            {formType !== null ? getForm() :
                <React.Fragment>
                    <Box sx={{margin: "30px"}}>
                        <FormControl fullWidth>
                            <InputLabel id="database-connection-input">Database Connection</InputLabel>
                            <Select
                                value={selectedDBId}
                                label="Database Connection"
                                onChange={handleDBChange}
                            >
                                <MenuItem value={null}></MenuItem>
                                {dbConnections.map((d: IDBConnection) => <MenuItem value={d.id}>{d.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                    {selectedDBId &&
                        <React.Fragment>
                            <Box sx={{margin: "30px"}}>
                                <FormControl fullWidth>
                                    <InputLabel>Table List</InputLabel>
                                    <Select
                                        value={selectedTable}
                                        label="Table List"
                                        onChange={handleTableChange}
                                    >
                                        {tableList.map((name: string) => <MenuItem value={name}>{name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{margin: "30px"}}>
                                <LayerCategoryControl api={mapApi} setLayerCategory={
                                    (layerCategory: ILayerCategory) => setLayerCategory(layerCategory)}
                                                      handleAddLayerCategory={() => setFormType("LayerCategory")}/>
                            </Box>
                            <Box sx={{margin: "30px"}}>
                                <Button color={"primary"} variant={"contained"} onClick={handleAddLayerInfo}>Add Layer Info</Button>
                            </Box>
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </React.Fragment>
    );
}

export default PostGISInfo
