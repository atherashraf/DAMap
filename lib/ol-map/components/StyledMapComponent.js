import { Paper, Select, styled } from "@mui/material";
export const SideDrawerDiv = styled('div')(({ theme }) => ({
    width: "350px",
    height: "99%",
    display: "flex",
    backgroundColor: "darkgray",
    padding: 4,
    // overflow: "auto"
}));
export const DrawerPaper = styled(Paper)(({ theme }) => ({
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    color: "white",
    overflow: "auto",
    // backgroundColor: "maroon"
}));
/*******
 * Form Controls
 */
const cmpColor = "white";
export const DASelect = styled(Select) `
 //& > div {
  //  border: 2px solid black;
  //  color:black
  //}
  //& > svg {
  //  color: black;
  //}
`;
export const DAFieldSet = styled('fieldset') `
  color: black;
`;
