import * as React from "react";
import {Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {visuallyHidden} from '@mui/utils';
import {StyledTableCell, StyledTableRow, EnhancedTableHeadProps} from "../TypeDeclaration";


export const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler =
        (property: string) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <StyledTableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </StyledTableCell>
                {props.columns.map((col) => (
                    <StyledTableCell
                        key={col.id}
                        align={col.type !== "string" ? 'center' : 'left'}
                        padding={col.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === col.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === col.id}
                            direction={orderBy === col.id ? order : 'asc'}
                            onClick={createSortHandler(col.id)}
                        >
                            {col.label}
                            {orderBy === col.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </StyledTableRow>
        </TableHead>
    );
}

