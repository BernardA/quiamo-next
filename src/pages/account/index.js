/* eslint-disable max-len */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Link from 'next/link';
// import { withRouter } from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import {
    Paper,
    Grid,
    List,
    ListItem,
    Divider,
    Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import UserViewer from '../../components/userViewer';
import {
    actionGetUserProfile,
    actionDeleteBlockedUser,
    actionToggleUserStatus,
    actionLogoutInit,
} from '../../store/actions';
import getCategories from '../../lib/getCategories';
import { handlePrivateRoute } from '../../tools/functions';
import Link from '../../components/link';

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

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            // isPermitted: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        /*
        const { cookies, router } = this.props;
        console.log('ACCOUNT mount props', this.props);
        let isPermitted = true;
        const { isAuthenticated, isAdmin } = isAuth(cookies);
        if (!isAuthenticated) {
            isPermitted = false;
            router.push({
                pathname: '/login',
                query: {from: router.pathname},
            });
        }
        if (isAuthenticated && router.pathname.includes('admin') && !isAdmin) {
            isPermitted = false;
            router.push('/');
        }
        this.setState({ isPermitted });
        */
        this.setProfile();
    }

    componentDidUpdate(prevProps) {
        const {
            cookies,
            errorDeleteBlockedUser,
            dataDeleteBlockedUser,
            errorToggleUserStatus,
            dataToggleUserStatus,
            userProfile,
        } = this.props;
        if (prevProps.userProfile !== userProfile) {
            this.setProfile();
        }
        if (!prevProps.errorDeleteBlockedUser && errorDeleteBlockedUser) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Unblock failed',
                    message: 'Please correct error below',
                    errors: errorDeleteBlockedUser,
                },
            });
        }
        if (!prevProps.dataDeleteBlockedUser && dataDeleteBlockedUser) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Unblock success',
                    message: 'User has been unblocked',
                    errors: {},
                },
            });
            this.props.actionGetUserProfile(cookies.get('userId'));
        }
        if (!prevProps.dataToggleUserStatus && dataToggleUserStatus) {
            this.props.actionLogoutInit();
        }
        if (!prevProps.errorToggleUserStatus && errorToggleUserStatus) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please try again',
                    errors: {},
                },
            });
        }
    }

    setProfile = () => {
        const { userProfile, cookies } = this.props;
        if (cookies.get('userId')) {
            if (userProfile) {
                this.setState({ userProfile });
            } else {
                localforage.getItem('userProfile').then((value) => {
                    if (value) {
                        this.setState({ userProfile: value });
                    } else {
                        this.props.actionGetUserProfile(cookies.get('userId'));
                    }
                });
            }
        }
    };

    handleUnblockUser = (event) => {
        this.props.actionDeleteBlockedUser(event.target.id);
    };

    handleMarkUserAsDeleted = () => {
        this.setState({
            notification: {
                status: 'confirm',
                title: 'Confirmation required',
                message: 'This action cannot be undone',
                errors: {},
            },
        });
    };

    handleNotificationDismiss = (event) => {
        const { title } = this.state.notification;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (title.includes('Confirmation') && event.target.id === 'confirmed') {
            this.props.actionToggleUserStatus({
                userId: this.props.userProfile.id,
                action: 'delete',
            });
        }
    };

    render() {
        const { classes, isLoading, isLoadingProfile, router } = this.props;
        const { userProfile } = this.state;

        // if (!isPermitted) {
        //     return null;
        // }
        return (
            <main className={classes.root}>
                {isLoading ||
                (isLoadingProfile && !userProfile) ||
                    !userProfile ? <Loading /> :
                    (
                        <Grid container spacing={3}>
                            <UserViewer
                                userProfile={userProfile}
                                handleUnblockUser={this.handleUnblockUser}
                                router={router}
                            />
                            <Grid item xs={12} sm={6}>
                                <Paper className={classes.paper}>
                                    <List
                                        className={classes.nav}
                                        component="nav"
                                        aria-label="account edit form"
                                    >
                                        <Link
                                            className={classes.link}
                                            href="/account/change-profile"
                                        >
                                            <ListItem
                                                button
                                                className={classes.listLinks}
                                            >
                                                <div
                                                    className={
                                                        classes.linkContainer
                                                    }
                                                >
                                                    <Typography>
                                                        Change personal info
                                                    </Typography>
                                                </div>
                                            </ListItem>
                                        </Link>
                                        <Divider />
                                        <Link
                                            className={classes.link}
                                            href="/account/change-address"
                                        >
                                            <ListItem
                                                button
                                                className={classes.listLinks}
                                            >
                                                <div
                                                    className={
                                                        classes.linkContainer
                                                    }
                                                >
                                                    <Typography>
                                                        Change address
                                                    </Typography>
                                                </div>
                                            </ListItem>
                                        </Link>
                                        <Divider />
                                        <Link
                                            className={classes.link}
                                            href="/account/change-password"
                                        >
                                            <ListItem
                                                button
                                                className={classes.listLinks}
                                            >
                                                <div
                                                    className={
                                                        classes.linkContainer
                                                    }
                                                >
                                                    <Typography>
                                                        Change password
                                                    </Typography>
                                                </div>
                                            </ListItem>
                                        </Link>
                                        <Divider />
                                        <Link
                                            className={classes.link}
                                            href="/account/upload-image"
                                        >
                                            <ListItem
                                                button
                                                className={classes.listLinks}
                                            >
                                                <div
                                                    className={
                                                        classes.linkContainer
                                                    }
                                                >
                                                    <Typography>
                                                        Upload image
                                                    </Typography>
                                                </div>
                                            </ListItem>
                                        </Link>
                                        <Link
                                            className={classes.link}
                                            href="/account/insert-provider"
                                        >
                                            <ListItem
                                                button
                                                className={classes.listLinks}
                                            >
                                                <div
                                                    className={
                                                        classes.linkContainer
                                                    }
                                                >
                                                    <Typography>
                                                        Add provided categories
                                                    </Typography>
                                                </div>
                                            </ListItem>
                                        </Link>
                                        <Divider />
                                        <ListItem
                                            button
                                            className={classes.link}
                                            onClick={this.handleMarkUserAsDeleted}
                                        >
                                            <div
                                                role="button"
                                                className={classes.linkContainer}
                                            >
                                                <Typography>
                                                    Delete account
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </main>
        );
    }
}

Account.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingProfile: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    actionDeleteBlockedUser: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    actionToggleUserStatus: PropTypes.func.isRequired,
    actionLogoutInit: PropTypes.func.isRequired,
    errorDeleteBlockedUser: PropTypes.any,
    dataDeleteBlockedUser: PropTypes.any,
    errorToggleUserStatus: PropTypes.any,
    dataToggleUserStatus: PropTypes.any,
    userProfile: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.account,
        userProfile: state.auth.userProfile,
        isLoadingProfile: state.auth.isLoading,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionDeleteBlockedUser,
            actionGetUserProfile,
            actionToggleUserStatus,
            actionLogoutInit,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Account)));

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    let categories = await getCategories();
    categories = categories.data.categories;
    handlePrivateRoute(context);
    return {
        props: {
            categories,
        },
    };
}
