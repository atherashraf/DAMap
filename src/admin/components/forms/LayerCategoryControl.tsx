import FormControl from "@mui/material/FormControl";
import {Button, Stack} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import {useState} from "react";
import MapApi, {MapAPIs} from "../../../ol-map/utils/MapApi";

export interface ILayerCategory {
    pk: string
    name: string
}

interface IProps {
    api: MapApi
    handleAddLayerCategory: Function
    setLayerCategory: (layerCategory: ILayerCategory) => void
}

const LayerCategoryControl = (props: IProps) => {
    const [layerCategories, setLayerCategories] = useState<any>([])
    const [selectLayerCat, setSelectLayerCat] = useState<ILayerCategory>()


    const handleLayerCategoryChange = (e) => {
        const value = e.target.value as ILayerCategory
        props.setLayerCategory(value)
        setSelectLayerCat(value)
    }
    const updateLayerCategories = () => {
        props.api.get(MapAPIs.DCH_LAYER_CATEGORIES).then((payload) => {
            setLayerCategories(payload)
        })
    }
    React.useEffect(() => {
        updateLayerCategories()
    }, [])
    return (
        <FormControl variant="standard" fullWidth={true}>
            <Stack direction={"row"}>
                <InputLabel id="layer-category-labell">
                    Layer Category
                </InputLabel>
                <Select
                    labelId="layer-category-label"
                    id="demo-simple-select-standard"
                    value={selectLayerCat}
                    // autoWidth
                    onChange={handleLayerCategoryChange}
                    sx={{flexGrow: 1}}

                >
                    {layerCategories && layerCategories.map((item) =>
                        (<MenuItem key={"key-" + item.name} value={item}>{item.name}</MenuItem>))}
                </Select>
                <Button onClick={() => props.handleAddLayerCategory()}><EditIcon/></Button>
            </Stack>
        </FormControl>
    )
}
export default LayerCategoryControl
