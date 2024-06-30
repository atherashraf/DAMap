import * as React from "react";
import MapVM from "../models/MapVM";
import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    TextField,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {MapAPIs} from "../utils/MapApi";
import _ from "../utils/lodash";
import {IGeoJSON} from "../TypeDeclaration";
import {TreeView} from "@mui/x-tree-view/TreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";

interface IProps {
    mapVM: MapVM;
}

interface INavigationItem {
    id: number;
    name: string;
    level_name: string;
    level: number;
    parent: string;
    parentId?: number;
}

interface INavigationList {
    level: INavigationItem[];
}

interface INavigationType {
    name: string;
    data: INavigationItem[];
}

interface ISelectedGeometry {
    nodeId: string;
    geometry: IGeoJSON;
}

const NavigationTree = (props: IProps) => {
    const [expandedNode, setExpandedNode] = React.useState<string[]>([]);
    const [selectedNode, setSelectedNode] = React.useState<string>();
    const [selectedGeometries, setSelectedGeometries] = React.useState<
        ISelectedGeometry[]
    >([]);
    const [allNavigationList, setAllNavigationList] = React.useState<
        INavigationType[]
    >([]);
    const [navigationList, setNavigationList] = React.useState<INavigationList>();
    const [maxLevel, setMaxLevel] = React.useState<number>(-1);
    const [selectedKey, setSelectedKey] = React.useState<string>();
    const [rootIds, setRootIds] = React.useState<string[]>([]);
    const [value, setValue] = React.useState(null);
    const [isZoomed, setIsZoomed] = React.useState<boolean>(false);

    //@ts-ignore
    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpandedNode(nodeIds);
    };
    //@ts-ignore
    const handleSelect = (event: React.SyntheticEvent, nodeIds: string) => {
        setSelectedNode(nodeIds);
    };

    const handleExpandClick = () => {
        // setExpandedNode((oldExpanded) =>
        //     oldExpanded.length === 0 ? rootIds : [],
        // );
        setExpandedNode(rootIds);
    };
    const updateNavigationList = React.useCallback((key: any) => {
        const data = allNavigationList[key]?.data;
        // if (!("id" in data[0]))
        //     data = data?.map((items, index) => ({...items, id: index, parentId: -1}))
        const maxLevel = _.getMaxValue(data, "level");
        setMaxLevel(maxLevel);
        const finalData = _.groupBy(data, "level");
        setNavigationList(finalData);
        setSelectedKey(key);
        const ids = finalData["0"].map((item: any) => String(item?.id));
        setRootIds(ids);
        setExpandedNode(ids);
    }, [allNavigationList]);

    React.useEffect(() => {
        const api = props.mapVM.getApi();
        api
            .get(MapAPIs.DCH_NAVIGATION_LIST, {map_uuid: props.mapVM.getMapUUID()})
            .then((payload) => {
                if (payload) {
                    setAllNavigationList(payload);
                }
            });
    }, [props.mapVM]);
    React.useEffect(() => {
        const keys = Object.keys(allNavigationList);
        if (keys.length > 0) {
            updateNavigationList(keys[0]);
        }
    }, [allNavigationList, updateNavigationList]);

    React.useEffect(() => {
        if (selectedNode && selectedKey) {
            const node_geom = selectedGeometries.find(
                (item) => item.nodeId === selectedNode
            );
            if (node_geom) {
                props.mapVM
                    .getSelectionLayer()
                    .addGeoJson2Selection(node_geom.geometry);
            } else {
                props.mapVM
                    .getApi()
                    .get(MapAPIs.DCH_NAVIGATION_GEOMETRY, {
                        map_uuid: props.mapVM.getMapUUID(),
                        selected_key: selectedKey,
                        node_id: selectedNode,
                    })
                    .then((payload) => {
                        if (payload) {
                            const lyr = props.mapVM.getSelectionLayer();
                            lyr.addGeoJson2Selection(payload);
                            // lyr.zoomToSelection()
                            // @ts-ignore
                            setSelectedGeometries([
                                ...selectedGeometries,
                                {
                                    nodeId: String(selectedNode),
                                    geometry: payload,
                                },
                            ]);
                        }
                    });
            }
        }
    }, [props.mapVM, selectedNode, selectedGeometries, selectedKey]);


    const getTreeItems = (data: INavigationList, level: number, parent: any) => {
        if (level > maxLevel) return;
        //@ts-ignore
        const d: INavigationItem[] = data[level];
        //@ts-ignore
        const jsx: any = d.map((item) => {
            if (item.parent === parent) {
                return (
                    <TreeItem key={item.id} nodeId={String(item.id)} label={item.name}>
                        {getTreeItems(data, level + 1, item.name)}
                    </TreeItem>
                );
            } else {
                return (<></>)
            }
        });
        // handleExpandClick()
        return jsx;
    };
    const getParentNodeIds = (nodeIds: any, parent: any, level: any) => {
        if (level < 0) return;
        // @ts-ignore
        const item = navigationList[level].find((item) => item.name === parent);
        nodeIds.push(item.id);
        getParentNodeIds(nodeIds, item.parent, level - 1);
    };
    const handleZoomToSelected = () => {
        if (!isZoomed) {
            props.mapVM.getSelectionLayer().zoomToSelection();
            setIsZoomed(true);
        } else {
            props.mapVM.zoomToFullExtent();
            setIsZoomed(false);
        }
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <Paper
            elevation={6}
            sx={{mx: 1, flexGrow: 1, height: "99%", overflowY: "auto"}}
        >
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedKey}
                sx={{mx: 2, my: 1, width: "90%"}}
                // label="Selec"
                size={"small"}
                // fullWidth={true}
                onChange={(e) => {
                    const key = e?.target?.value as string;
                    updateNavigationList(key);
                }}
            >
                {Object.keys(allNavigationList).map((k: any) => (
                    <MenuItem value={k}>{allNavigationList[k].name}</MenuItem>
                ))}
            </Select>
            <Autocomplete
                id="combo-box-demo"
                //@ts-ignore
                options={allNavigationList[selectedKey]?.data || []}
                value={value}
                //@ts-ignore
                onChange={(event, newValue: any) => {
                    const nodeIds = [newValue?.id];
                    getParentNodeIds(nodeIds, newValue?.parent, newValue?.level - 1);
                    setExpandedNode(nodeIds);
                    setSelectedNode(nodeIds[0]);
                    setValue(newValue);
                }}
                sx={{mx: 2}}
                autoHighlight
                getOptionLabel={(option) => `${option?.id}-${option?.name}`}
                // getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        size={"small"}
                        label={"Select Boundary"}
                    />
                )}
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
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                expanded={expandedNode}
                selected={selectedNode}
                onNodeToggle={handleToggle}
                //@ts-ignore
                onNodeSelect={handleSelect}
            >
                {
                    //@ts-ignore
                    getTreeItems(navigationList, 0, null)
                }
            </TreeView>
        </Paper>
    );
};

export default NavigationTree;
