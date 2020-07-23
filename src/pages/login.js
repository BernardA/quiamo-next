import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
} from '@material-ui/core/';
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
import styles from '../styles/login.module.scss';
import Link from '../components/link';
import { LANG } from '../parameters';

const trans = {
    br: {
        refreshMomentarily: 'Esta pagina vai se recarregar em instantes',
        adWasPublished: 'Seu anuncio foi publicado',
        redirectedTo: 'Voce sera redirecionado para',
        somethingWrong: 'Algo deu errado',
        seemOffline: 'Parece que nao ha conexao',
        logginNotPossible: 'Impossivel de se conectar',
        googleFailure: 'Problema com Google login. Tente de novo',
        login: 'Acessar sua conta',
        requiresLogin: 'A pagina procurada necessita conexao',
        notYetMember: 'Ainda nao tem conta',
        signUp: 'Criar conta',
        orWithEmail: 'ou com seu e-mail',
        offlineLoginDisabled: 'Parece nao have conexao. Impossivel de se conectar',
        registerFirst: 'Certifique-se que voce ja criou uma conta',
    },
    en: {
        refreshMomentarily: 'This page will refresh momentarily',
        adWasPublished: 'Your ad was published',
        redirectedTo: 'You will be redirected to',
        nowConnected: 'You are now connected',
        somethingWrong: 'Something went wrong',
        seemOffline: 'You seem to be offline',
        logginNotPossible: 'Loggin in is not possible',
        googleFailure: 'Google login failure. Please retry',
        login: 'Login',
        requiresLogin: 'The page you tried to access requires login',
        notYetMember: 'Not yet a member',
        signUp: 'Sign up',
        orWithEmail: 'or with your email',
        offlineLoginDisabled: 'You seem to be offline. Login is disabled',
        registerFirst: 'Check that you have already registered'
    }
}

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
        const { isOnline, token, errorReq, errorSocialLogin } = this.props;
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
        if (!prevProps.errorSocialLogin && errorSocialLogin) {
            this.setState({
                notification: {
                    status: 'error',
                    title: trans[LANG].somethingWrong,
                    message: trans[LANG].registerFirst,
                    errors: {},
                },
            });
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
        // get referred path, ie, user intended url when redirected to login
        const isAdmin =
            !!roles.includes('ROLE_ADMIN') ||
            !!roles.includes('ROLE_SUPERADMIN');
        let redirectAs = '/';
        let redirectHref = '/';
        if (isAdmin) {
            redirectAs = 'admin';
            redirectHref = '/admin';
        }
        if (router.query && router.query.href) {
            redirectHref = router.query.href;
            redirectAs= router.query.as;
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
                            {trans[LANG].refreshMomentarily}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            {isPendingAd ? trans[LANG].adWasPublished : null}
                            {`${trans[LANG].redirectedTo} ${redirectAs}`}
                        </Typography>
                    </>
                );
            };
            this.setState({
                notification: {
                    status: 'ok',
                    title: trans[LANG].nowConnected,
                    message: message(),
                    errors: {},
                },
            });
            // redirect user after timeout for notification
            setTimeout(() => {
                router.push(redirectHref, redirectAs);
            }, 3000);
        });
    };

    handlePostLoginError = () => {
        const { errorReq } = this.props;
        this.setState({
            notification: {
                status: 'error',
                title: trans[LANG].somethingWrong,
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
                title: trans[LANG].seemOffline,
                message: trans[LANG].logginNotPossible,
                errors: {},
            },
        });
    };

    handleSocialLoginFailure = () => {
        this.setState({
            isErrorSocialLogin: true,
            notification: {
                status: 'error',
                title: trans[LANG].somethingWrong,
                message: trans[LANG].googleFailure,
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
                                        {trans[LANG].login}
                                    </Typography>
                                )}
                                subheader={router.query && router.query.href ? (
                                    <Typography
                                        className={styles.subheader}
                                    >
                                        {trans[LANG].requiresLogin}
                                    </Typography>
                                ) : null}
                            />
                            <CardContent className={styles.content}>
                                <div>
                                    <span>{`${trans[LANG].notYetMember}?`}</span>
                                    <Link href="/register">
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            {trans[LANG].signUp}
                                        </Button>
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
                                                appId={process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN}
                                                onLoginSuccess={this.handleSocialLogin}
                                                onLoginFailure={this.handleSocialLoginFailure}
                                            >
                                                <img src="/images/btn_google_signin_dark_pressed_web@2x.png" alt="google signin" />
                                            </SocialButton>
                                            <Typography
                                                className={styles.lineWrapSpan}
                                                variant="overline"
                                            >
                                                {trans[LANG].orWithEmail}
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
                    <NotifierInline message={trans[LANG].offlineLoginDisabled} />
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
    errorSocialLogin: PropTypes.any,
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