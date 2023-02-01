import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
