import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableRow from '@material-ui/core/TableRow';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    linkContainer: {
        textAlign: 'center',
    },
    link: {
        textDecoration: 'none',
        textTransform: 'uppercase',
        color: 'initial',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
    details: {
        padding: theme.spacing(1),
    },
});

const Address = (props) => {
    const { classes, userProfile } = props;
    if (userProfile.address) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1b-content"
                    id="panel1b-header"
                >
                    <Typography className={classes.heading}>Address</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    <Paper className={classes.paper}>
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                        >
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Street number
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.address.address1}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Street
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.address.address2}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Complement
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.address.address3 || null}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        City
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.address.city}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Postal code
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.address.postalCode}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </AccordionDetails>
            </Accordion>
        );
    }
    return 'No address informed';
};

export default withStyles(styles)(Address);
