import * as React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Typography,
} from "@mui/material";

export default function MapAdmin() {
  const items = {
    DCH: [
      { name: "Layer Info", href: "/LayerInfo" },
      { name: "Map Info", href: "/MapInfo" },
    ],
  };
  return (
    <React.Fragment>
      {Object.keys(items).map((key) => (
        <Accordion key={"accordion-" + key} expanded={true}>
          <AccordionSummary
            key={"accordion-summary-" + key}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography key={"typo-" + key}>{key}</Typography>
          </AccordionSummary>
          <AccordionDetails key={"accordion-detail-" + key}>
            <List key={"accordion-list-" + key}>
              {
                //@ts-ignore
                items[key].map((item: any) => (
                  <ListItem key={item.name}>
                    <a href={item.href}>{item.name}</a>
                  </ListItem>
                ))
              }
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
}
