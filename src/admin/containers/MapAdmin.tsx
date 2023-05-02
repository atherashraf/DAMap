import * as React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography} from "@mui/material";

export default  function MapAdmin() {
    const items = {
        DCH: [
            {name: "Layer Info", href: "/LayerInfo"},
            {name: "Map Info", href: "/MapInfo"}
        ]
    }
    return (
        <React.Fragment>
            {Object.keys(items).map((key) => (
                <Accordion expanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{key}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {items[key].map((item) => (
                                <ListItem><a href={item.href}>{item.name}</a></ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}

        </React.Fragment>
    )
}
