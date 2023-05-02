import {
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow, Input,
    MenuItem,
    MenuList,
    Paper,
    Popper, TextField,
    Tooltip
} from "@mui/material";
import * as React from "react";
import MapVM from "../../../models/MapVM";
import {MapAPIs} from "../../../utils/MapApi";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DASelectButton from "../../common/DASelectButton";
import {MouseEventHandler} from "react";
import LegendGridJqx from "../atoms/LegendGridJqx";

interface IProps {
    mapVM: MapVM
}

const PredefinedStyling = (props: IProps) => {

    const [options, setPredefinedList] = React.useState([{"name": 'Add New Style', style: null}]);
    const [styleName, setStyleName] = React.useState("")

    React.useEffect(() => {
        props.mapVM.getApi().get(MapAPIs.DCH_PREDEFINED_LIST).then((payload) => {
            if (payload) {
                const p = [...options, ...payload]
                // console.log(p)
                setPredefinedList(p)
            }
        })
    }, [])

    const handleClick = (e: MouseEventHandler<HTMLButtonElement>, selectedIndex: number) => {

        const option = options[selectedIndex];
        if (option.name == 'Add New Style') {
            props.mapVM.getDialogBoxRef()?.current?.openDialog({
                content:
                    <>
                        <Box sx={{display: 'flex', flex: 1, p: 2, justifyContent: 'center'}}>
                            <TextField label={"Add Style Name"} defaultValue={styleName} variant={"standard"}
                                       onChange={
                                           (e) => setStyleName(e.target.value as string)
                                       }/>
                        </Box>
                        <Box sx={{flex: 1}}>
                            <LegendGridJqx/>
                        </Box>
                    </>
            })
        } else {
            console.info(`You clicked ${options[selectedIndex].name}`);
        }
    };


    return (
        <React.Fragment>

            <Box sx={{flex: 1}}>
                <DASelectButton options={options}
                                handleClick={handleClick}/>
            </Box>
        </React.Fragment>
    )
}

export default PredefinedStyling
