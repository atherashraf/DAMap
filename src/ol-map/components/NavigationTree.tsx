import * as React from "react"
import MapVM from "../models/MapVM";
import {Autocomplete, Box, Button, MenuItem, Paper, Select, TextField} from "@mui/material"
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {MapAPIs} from "../utils/MapApi";
import _ from "../utils/lodash";
import {IGeoJSON} from "../TypeDeclaration";

interface IProps {
    mapVM: MapVM
}


interface INavigationItem {
    id: number
    name: string
    level_name: string
    level: number
    parent: string
    parentId?: number
}

interface INavigationList {
    level: INavigationItem[]

}

interface INavigationType {
    name: string
    data: INavigationItem[]
}

interface ISelectedGeometry {
    nodeId: string
    geometry: IGeoJSON
}

const NavigationTree = (props: IProps) => {
    const [expandedNode, setExpandedNode] = React.useState<string[]>([]);
    const [selectedNode, setSelectedNode] = React.useState<string>();
    const [selectedGeometries, setSelectedGeometries] = React.useState<ISelectedGeometry[]>([])
    const [allNavigationList, setAllNavigationList] = React.useState<INavigationType[]>([])
    const [navigationList, setNavigationList] = React.useState<INavigationList>(null)
    const [maxLevel, setMaxLevel] = React.useState<number>(-1)
    const [selectedKey, setSelectedKey] = React.useState<string>(null)
    const [rootIds, setRootIds] = React.useState<string[]>([])
    const [value, setValue] = React.useState(null);
    const [isZoomed, setIsZoomed] = React.useState<boolean>(false)

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpandedNode(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeIds: string) => {
        console.log(nodeIds)
        setSelectedNode(nodeIds);

    };

    const handleExpandClick = () => {
        // setExpandedNode((oldExpanded) =>
        //     oldExpanded.length === 0 ? rootIds : [],
        // );
        setExpandedNode(rootIds);
    };
    React.useEffect(() => {
        const api = props.mapVM.getApi();
        api.get(MapAPIs.DCH_NAVIGATION_LIST, {map_uuid: props.mapVM.getMapUUID()})
            .then((payload) => {
                if (payload) {
                    setAllNavigationList(payload)
                }
            })
    }, [])
    React.useEffect(() => {
        const keys = Object.keys(allNavigationList)
        console.log(keys)
        if (keys.length > 0) {
            // console.log("all navigation list", allNavigationList)
            updateNavigationList(keys[0])
        }
    }, [allNavigationList])

    React.useEffect(() => {
        console.log("selected node", selectedGeometries)

        if (selectedNode && selectedKey) {
            const node_geom = selectedGeometries.find((item) => item.nodeId == selectedNode)
            if (node_geom) {
                console.log("already available")
                props.mapVM.getSelectionLayer().addGeoJson2Selection(node_geom.geometry)
            } else {
                props.mapVM.getApi().get(MapAPIs.DCH_NAVIGATION_GEOMETRY,
                    {
                        "map_uuid": props.mapVM.getMapUUID(),
                        selected_key: selectedKey,
                        node_id: selectedNode
                    }).then((payload) => {
                    if (payload) {
                        console.log(payload)
                        const lyr = props.mapVM.getSelectionLayer()
                        lyr.addGeoJson2Selection(payload)
                        // lyr.zoomToSelection()
                        // @ts-ignore
                        setSelectedGeometries([...selectedGeometries, {
                            nodeId: String(selectedNode),
                            geometry: payload
                        }])
                    }
                });
            }
        }

    }, [selectedNode])

    const updateNavigationList = (key) => {
        let navList = []
        const data = allNavigationList[key]?.data
        console.log("navigation data", data)
        // if (!("id" in data[0]))
        //     data = data?.map((items, index) => ({...items, id: index, parentId: -1}))
        const maxLevel = _.getMaxValue(data, "level")
        setMaxLevel(maxLevel)
        console.log("max level", maxLevel)
        const finalData = _.groupBy(data, "level")
        setNavigationList(finalData)
        console.log("final data", finalData)
        setSelectedKey(key)
        const ids = finalData["0"].map((item) => String(item?.id))
        setRootIds(ids)
        setExpandedNode(ids)
    }

    const getTreeItems = (data: INavigationList, level: number, parent) => {
        if (level > maxLevel) return
        //@ts-ignore
        const d: INavigationItem[] = data[level]
        const jsx: any = d.map((item) => {
            if (item.parent == parent) {
                return <TreeItem key={item.id} nodeId={String(item.id)} label={item.name}>

                    {getTreeItems(data, (level + 1), item.name)}
                </TreeItem>
            }
        });
        // handleExpandClick()
        return jsx;
    }
    const getParentNodeIds = (nodeIds, parent, level) => {
        if (level < 0) return
        // @ts-ignore
        const item = navigationList[level].find((item) => item.name == parent)
        nodeIds.push(item.id)
        getParentNodeIds(nodeIds, item.parent, level - 1)

    }
    const handleZoomToSelected = () => {
        if (!isZoomed) {
            props.mapVM.getSelectionLayer().zoomToSelection()
            setIsZoomed(true)
        } else {
            props.mapVM.zoomToFullExtent()
            setIsZoomed(false)
        }
    }
    return (
        <Paper elevation={6} sx={{mx: 1, flexGrow: 1, height: "99%", overflowY: 'auto'}}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedKey}
                sx={{mx: 2, my:1, width:"90%"}}
                // label="Selec"
                size ={"small"}
                // fullWidth={true}
                onChange={(e)=>{
                    const key = e?.target?.value as string
                    console.log("updated key", key)
                    updateNavigationList(key)
                }}
            >
                {Object.keys(allNavigationList).map((k)=><MenuItem value={k}>{allNavigationList[k].name}</MenuItem>)}
            </Select>
            <Autocomplete
                id="combo-box-demo"
                options={allNavigationList[selectedKey]?.data || []}
                value={value}
                onChange={(event, newValue) => {
                    const nodeIds = [newValue.id]
                    getParentNodeIds(nodeIds, newValue.parent, newValue.level - 1)
                    // console.log(nodeIds)
                    setExpandedNode(nodeIds)
                    setSelectedNode(nodeIds[0])
                    setValue(newValue);
                }}
                sx={{mx: 2}}
                autoHighlight
                getOptionLabel={(option) => `${option.id}-${option.name}`}
                // getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} variant="standard" size={"small"}
                                                    label={"Select Boundary"}/>}
            />
            <Box sx={{mb: 1}}>
                <Button onClick={handleZoomToSelected}>
                    {/*{isZoomed ? 'Zoom Back' : 'Zoom To Selected'}*/}
                    Zoom
                </Button>
                <Button onClick={handleExpandClick}>
                    {/*{expandedNode.length === 0 ? 'Expand all' : 'Collapse all'}*/}
                    Collapse
                </Button>

            </Box>
            <TreeView
                aria-label="controlled"
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                expanded={expandedNode}
                selected={selectedNode}
                onNodeToggle={handleToggle}
                onNodeSelect={handleSelect}
            >
                {getTreeItems(navigationList, 0, null)}
            </TreeView>
        </Paper>
    );
}

export default NavigationTree
