import { withStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Address from './accountAddress';
import Image from './userProfileImage';
import BlockedUsers from './accountBlockedUsers';
import { showtime } from '../tools/functions';

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
        height: '20%',
        minHeight: '50px',
    },
    listLinks: {
        height: '100%',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        height: '100%',
        boxShadow: 'none',
    },
    nav: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    table: {
        '& td': {
            padding: '16px 4px',
        },
        '& th': {
            padding: '16px 4px',
        },
    },
});

const userViewer = (props) => {
    const { classes, userProfile, handleUnblockUser, location } = props;
    const isAdmin = location.pathname.includes('admin');
    return (
        <>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {isAdmin ? 'User' : 'My account'}
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>
                    {userProfile ? (
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                        >
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Name
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.name || 'No name informed'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Username
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.username}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Email
                                    </TableCell>
                                    <TableCell align="right">
                                        {userProfile.email}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        scope="row"
                                        align="right"
                                        colSpan="2"
                                    >
                                        <Address userProfile={userProfile} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        scope="row"
                                        align="right"
                                        colSpan="2"
                                    >
                                        <Image
                                            isAdmin={isAdmin}
                                            userProfile={userProfile}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        scope="row"
                                        align="right"
                                        colSpan="2"
                                    >
                                        <BlockedUsers
                                            isAdmin={isAdmin}
                                            userProfile={userProfile}
                                            handleUnblockUser={
                                                handleUnblockUser
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="column">
                                        Member since:
                                    </TableCell>
                                    <TableCell align="right">
                                        {showtime(userProfile.createdAt)}
                                    </TableCell>
                                </TableRow>
                                {location.pathname.includes('admin') ? (
                                    <>
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="column"
                                            >
                                                Enabled status:
                                            </TableCell>
                                            <TableCell align="right">
                                                {userProfile.isEnabled
                                                    ? 'enabled'
                                                    : 'disabled'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="column"
                                            >
                                                Deleted:
                                            </TableCell>
                                            <TableCell align="right">
                                                {userProfile.deletedAt
                                                    ? showtime(userProfile.deletedAt)
                                                    : 'na'}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ) : null}
                            </TableBody>
                        </Table>
                    ) : null}
                </Paper>
            </Grid>
        </>
    );
};

userViewer.propTypes = {
    userProfile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    handleUnblockUser: PropTypes.func,
    location: PropTypes.object.isRequired,
};

export default withStyles(styles)(userViewer);
