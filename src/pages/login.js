import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Link from 'next/link';
import { withRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import getCategories from '../lib/getCategories';
import { Loading } from '../components/loading';
import LoginForm from '../components/loginForm';
import NotifierDialog from '../components/notifierDialog';
import NotifierInline from '../components/notifierInline';
import SocialButton from '../components/socialButton';
import {
    actionPostLogin,
    actionPostSocialLoginGoogle,
    actionPutUserToAd,
} from '../store/actions';
import { GOOGLE_SOCIAL_LOGIN } from '../parameters';
import styles from '../styles/login.module.scss';
import Link from '../components/link';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isErrorSocialLogin: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const { isOnline, token, errorReq } = this.props;
        if (prevProps.token !== token && token) {
            this.handlePostLoginOk();
        }
        // TODO handle each error separately
        if (prevProps.errorReq !== errorReq && errorReq) {
            this.handlePostLoginError();
        }
        if (prevProps.isOnline !== isOnline && !isOnline) {
            this.handlePostLoginOffline();
        }
    }

    onSubmitLogin = () => {
        this.props.actionPostLogin(this.props.loginForm.values);
    };

    handleSocialLogin = (user) => {
        const idToken = user._token.idToken;
        this.props.actionPostSocialLoginGoogle(idToken);
    };

    handlePostLoginOk = () => {
        const { roles, router } = this.props;
        console.log('roles', roles);
        console.log('router', router);
        // get referred path, ie, user intended url when redirected to login
        const isAdmin =
            !!roles.includes('ROLE_ADMIN') ||
            !!roles.includes('ROLE_SUPERADMIN');
        let redirectPage = 'homepage';
        let redirectPath = '/';
        if (isAdmin) {
            redirectPage = 'admin';
            redirectPath = '/admin';
        }
        if (router.query && router.query.from) {
            redirectPage = router.query.from;
            redirectPath = router.query.from;
        }
        localforage.getItem('pendingAdId').then((value) => {
            let isPendingAd = false;
            if (value !== null) {
                isPendingAd = true;
                const data = {
                    ad: value,
                    user: this.props.userId,
                };
                this.props.actionPutUserToAd(data);
                localforage.removeItem('pendingAdId');
            }
            const message = () => {
                return (
                    <>
                        <Typography variant="subtitle2">
                            This page will refresh momentarily.
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            {isPendingAd ? 'Your ad was published. ' : null}
                            {`You will be redirected to ${redirectPage}`}
                        </Typography>
                    </>
                );
            };
            this.setState({
                notification: {
                    status: 'ok',
                    title: 'You are now connected.',
                    message: message(),
                    errors: {},
                },
            });
            // redirect user after timeout for notification
            setTimeout(() => {
                router.push(redirectPath);
            }, 3000);
        });
    };

    handlePostLoginError = () => {
        const { errorReq } = this.props;
        this.setState({
            notification: {
                status: 'error',
                title: 'There was an error.',
                message: errorReq[0].message,
                errors: {},
            },
        });
    };

    handlePostLoginOffline = () => {
        // check if offline event already fired
        localforage.getItem('offline-event-fired').then((data) => {
            if (data === null) {
                window.dispatchEvent(new Event('offline'));
                localforage.setItem('offline-event-fired', true);
            }
        });
        this.setState({
            notification: {
                status: 'ok_and_dismiss',
                title: 'You seem to be offline.',
                message: 'Loggin in is not possible',
                errors: {},
            },
        });
    };

    handleSocialLoginFailure = () => {
        this.setState({
            isErrorSocialLogin: true,
            notification: {
                status: 'error',
                title: 'There was an error',
                message: 'Google login failure. Please retry.',
                errors: {},
            },
        });
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
    };

    render() {
        console.log('LOGIN props', this.props);
        const { isLoading, isOnline, router } = this.props;
        const { isErrorSocialLogin } = this.state;
        return (
            <>
                {isOnline ? (
                    <main id="login_page">
                        {isLoading ? <Loading /> : null}
                        <Card id="noShadow" className={styles.root}>
                            <CardHeader
                                className={styles.header}
                                title={(
                                    <Typography
                                        className={styles.title}
                                        component="h3"
                                    >
                                        Login
                                    </Typography>
                                )}
                                subheader={router.query && router.query.from ? (
                                    <Typography
                                        className={styles.subheader}
                                    >
                                        The page you tried to access
                                        requires login.
                                    </Typography>
                                ) : null}
                            />
                            <CardContent className={styles.content}>
                                <div>
                                    <Link href="/register">
                                        <span>not yet a member? sign up</span>
                                    </Link>
                                </div>
                                {
                                    // https://www.gatsbyjs.org/docs/debugging-html-builds/
                                    !isErrorSocialLogin && typeof window !== 'undefined' ? (
                                        <>
                                            <SocialButton
                                                className={
                                                    styles.socialSignin
                                                }
                                                provider="google"
                                                appId={GOOGLE_SOCIAL_LOGIN}
                                                onLoginSuccess={
                                                    this.handleSocialLogin
                                                }
                                                onLoginFailure={
                                                    this
                                                        .handleSocialLoginFailure
                                                }
                                            >
                                                <img src="/images/btn_google_signin_dark_pressed_web@2x.png" alt="google signin" />
                                            </SocialButton>
                                            <Typography
                                                className={
                                                    styles.lineWrapSpan
                                                }
                                                variant="overline"
                                            >
                                                or with your email
                                            </Typography>
                                        </>
                                    ) : null
                                }
                                <LoginForm
                                    submitLogin={this.onSubmitLogin}
                                />
                            </CardContent>
                        </Card>
                        <NotifierDialog
                            notification={this.state.notification}
                            handleNotificationDismiss={
                                this.handleNotificationDismiss
                            }
                        />
                    </main>
                ) : (
                    <NotifierInline message="You seem to be offline. Login is disabled." />
                )}
            </>
        );
    }
}

Login.propTypes = {
    actionPostLogin: PropTypes.func.isRequired,
    actionPostSocialLoginGoogle: PropTypes.func.isRequired,
    actionPutUserToAd: PropTypes.func.isRequired,
    loginForm: PropTypes.any,
    router: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    roles: PropTypes.array,
    userId: PropTypes.any,
    errorReq: PropTypes.any,
    token: PropTypes.any,
    isOnline: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.auth,
        ...state.onlineStatus,
        loginForm: state.form.LoginForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostLogin,
            actionPostSocialLoginGoogle,
            actionPutUserToAd,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}