import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
} from '@material-ui/core';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { actionPutUserProfile, actionGetUserProfile } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import Breadcrumb from '../../components/breadcrumb';
import { Loading } from '../../components/loading';
import UserProfileChangeForm from '../../components/userProfileChangeForm';
import styles from '../../styles/login.module.scss';
import getCategories from '../../lib/getCategories';
import { handleIsNotAuthenticated, handleCheckAuthentication } from '../../tools/functions';

class AccountProfileChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResetForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const {
            userProfile,
            router,
            cookies,
            isAuth: { isAuthenticated },
        } = this.props;        
        if (!isAuthenticated) {
            handleIsNotAuthenticated(router);
        } else if (!userProfile) {
            this.props.actionGetUserProfile(cookies.get('userId'));
        }
    }

    componentDidUpdate(prevProps) {
        const { errorProfile, dataProfile } = this.props;
        if (!prevProps.errorProfile && errorProfile) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct errors below.',
                    errors: errorProfile,
                },
            });
        }
        if (!prevProps.dataProfile && dataProfile) {
            this.props.actionGetUserProfile(this.props.cookies.get('userId'));
            this.setState({
                isResetForm: true,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your changes were processed.',
                    errors: {},
                },
            });
        }
    }

    handleSubmitProfileChange = () => {
        const values = this.props.profileChangeForm.values;
        values.userId = this.props.cookies.get('userId');
        this.props.actionPutUserProfile(values);
    };

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });

        if (this.props.dataProfile) {
            this.props.router.push('/account');
        }
    };

    render() {
        const { isResetForm } = this.state;
        const {
            isLoading,
            userProfile,
            isSocialLogin,
            isAuth: { isAuthenticated },
        } = this.props;
        if (!isAuthenticated) {
            return null;
        }
        return (
            <main>
                {isLoading || !userProfile ? <Loading /> : null}
                <Breadcrumb links={[
                    { href: '/account', text: 'account' },
                    { href: null, text: 'change-profile' },
                ]}
                />
                {userProfile ?
                    (
                        <Card id="noShadow" className={styles.root}>
                            <CardHeader
                                className={styles.header}
                                title={(
                                    <Typography className={styles.title} component="h3">
                                        Profile change
                                    </Typography>
                                )}
                            />
                            <CardContent className={styles.content}>
                                <UserProfileChangeForm
                                    handleSubmitProfileChange={this.handleSubmitProfileChange}
                                    userProfile={userProfile}
                                    isSocialLogin={isSocialLogin}
                                    isResetForm={isResetForm}
                                />
                            </CardContent>
                        </Card>
                    ) : null}
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={
                        this.handleNotificationDismiss
                    }
                />
            </main>
        );
    }
}

AccountProfileChange.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    profileChangeForm: PropTypes.any,
    actionPutUserProfile: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    errorProfile: PropTypes.any,
    dataProfile: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    userProfile: PropTypes.any,
    isSocialLogin: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    isAuth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.account,
        isSocialLogin: state.auth.isSocialLogin,
        userProfile: state.auth.userProfile,
        profileChangeForm: state.form.UserProfileChangeForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPutUserProfile,
            actionGetUserProfile,
        },
        dispatch,
    );
}
// https://redux-form.com/7.2.2/docs/faq/howtoconnect.md/
// eslint-disable-next-line no-class-assign
AccountProfileChange = withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(AccountProfileChange)));

export default AccountProfileChange;

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    const categories = await getCategories();
    return {
        props: {
            categories: categories.data.categories,
            isAuth: handleCheckAuthentication(context),
        },
    };
}