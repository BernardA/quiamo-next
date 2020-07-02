import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
});

const BlockedUsers = (props) => {
    const {
        classes, userProfile, handleUnblockUser, isAdmin,
    } = props;
    if (userProfile.blockedUsers.length > 0) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <Typography className={classes.heading}>
                        Blocked users
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper className={classes.paper}>
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography>User</Typography></TableCell>
                                    <TableCell align="right">
                                        <Typography>Action</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userProfile.blockedUsers.map((row) => (
                                    <TableRow key={row.blocked.id}>
                                        <TableCell>
                                            {row.blocked.username}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                id={row.id}
                                                onClick={handleUnblockUser}
                                            >
                                                Unblock
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </AccordionDetails>
            </Accordion>
        );
    }
    return isAdmin ? 'No blocked users' : 'You have not blocked any users';
};

BlockedUsers.propTypes = {
    userProfile: PropTypes.any,
    classes: PropTypes.object.isRequired,
    handleUnblockUser: PropTypes.func.isRequired,
};

export default withStyles(styles)(BlockedUsers);