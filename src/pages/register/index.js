import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import Geocode from 'react-geocode';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import RegisterForm from '../../components/registerForm';
import SocialButton from '../../components/socialButton';
import NotifierDialog from '../../components/notifierDialog';
import NotifierInline from '../../components/notifierInline';
import {
    actionSocialRegisterGoogle,
    actionRegister,
    actionPostAddress,
} from '../../store/actions';
import styles from '../../styles/register.module.scss';
import Link from '../../components/link';
import getCategories from '../../lib/getCategories';

class RegisterHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClearForm: false,
            isSocialButton: true,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const {
            dataAddress,
            dataGoogle,
            dataRegister,
            errorAddress,
            errorRegister,
            errorSocial,
        } = this.props;

        if (prevProps.errorAddress !== errorAddress && errorAddress) {
            this.handleAddressError(errorAddress);
        }
        if (prevProps.dataAddress !== dataAddress && dataAddress) {
            this.handleAddressOk(dataAddress);
        }

        if (prevProps.errorSocial !== errorSocial && errorSocial) {
            this.handleSocialRegisterError();
        }
        if (prevProps.dataGoogle !== dataGoogle && dataGoogle) {
            this.handleSocialRegisterOk();
        }

        if (prevProps.errorRegister !== errorRegister && errorRegister) {
            this.handleRegisterError(errorRegister);
        }
        if (prevProps.dataRegister !== dataRegister && dataRegister) {
            this.handleRegisterOk(dataRegister);
        }
    }

    onSubmitRegister = () => {
        const values = this.props.registerForm.values;
        // get coordinates
        const address = `${values.address1} ${values.address2} ${values.city} ${values.postalCode} France`;
        Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
        Geocode.fromAddress(address)
            .then((response) => {
                const { lat, lng } = response.results[0].geometry.location;
                values.lat = lat;
                values.lng = lng;
                this.props.actionPostAddress(values);
            })
            .catch(() => {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'Address error',
                        message:
                            'Your address does not seem valid. Please verify',
                        errors: {},
                    },
                });
            });
    };

    handleAddressError = (errors) => {
        this.setState({
            notification: {
                status: 'error',
                title: 'There was an error.',
                message: 'Please review the following:',
                errors,
            },
        });
    };

    handleAddressOk = (data) => {
        const values = this.props.registerForm.values;
        values.address = data.address.id;
        this.props.actionRegister(values);
    };

    handleSocialLogin = (user) => {
        const idToken = user._token.idToken;
        this.props.actionSocialRegisterGoogle(idToken);
    };

    handleSocialRegisterOk = () => {
        this.setState({
            isClearForm: true,
            notification: {
                status: 'ok_and_dismiss',
                title: 'Registration initiated.',
                message:
                    'Additional info is required to complete registration. You will be redirect.',
                errors: {},
            },
        });
        setTimeout(() => { this.props.router.push('/register/social'); }, 3000);
    };

    handleSocialRegisterError = () => {
        this.setState({
            isSocialButton: false,
            notification: {
                status: 'error',
                title: 'There was an error',
                message: this.props.errorSocial[0].error,
                errors: {},
            },
        });
    };

    handleSocialLoginFailure = () => {
        this.setState({
            notification: {
                status: 'error',
                title: 'There was an error',
                message: 'Failure to authenticate. Please retry.',
                errors: {},
            },
        });
    };

    handleRegisterError = (errors) => {
        this.setState({
            notification: {
                status: 'error',
                title: 'There was an error.',
                message: 'Please review the following:',
                errors,
            },
        });
    };

    handleRegisterOk = () => {
        const message = `A confirmation e-mail was sent to 
        ${this.props.registerForm.values.email}. 
        Please check your mailbox and click on the link on that e-mail.`;
        this.setState({
            isClearForm: true,
            notification: {
                status: 'ok_and_dismiss',
                title: 'You are now registered.',
                message,
                errors: {},
            },
        });
    };

    handleOffline = () => {
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
                message: 'Not possible to register when offline',
                errors: {},
            },
        });
    };

    handleNotificationDismiss = () => {
        const { dataRegister, dataGoogle, router } = this.props;
        this.setState({
            isSocialButton: true,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (dataRegister) {
            setTimeout(() => { router.push('/'); }, 2000);
        } else if (dataGoogle) {
            setTimeout(() => { router.push('/registe/social'); }, 2000);
        }
    };

    render() {
        const { isOnline, isLoading } = this.props;
        return (
            <>
                {isOnline ? (
                    <main>
                        {isLoading ? <Loading /> : null}
                        <Card id="noShadow" className={styles.root}>
                            <CardHeader
                                className={styles.header}
                                title={(
                                    <Typography
                                        className={styles.title}
                                        component="h3"
                                    >
                                        Registration
                                    </Typography>
                                )}
                            />
                            <CardContent className={styles.content}>
                                <div>
                                    <Link to="/login">
                                        already a member? login
                                    </Link>
                                </div>
                                {this.state.isSocialButton && typeof window !== 'undefined' ? (
                                    <>
                                        <SocialButton
                                            className={styles.socialSignin}
                                            provider="google"
                                            appId={process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN}
                                            onLoginSuccess={this.handleSocialLogin}
                                            onLoginFailure={
                                                this.handleSocialLoginFailure
                                            }
                                        >
                                            <img src="/images/btn_google_signin_dark_pressed_web@2x.png" alt="google signin" />
                                        </SocialButton>
                                        <Typography
                                            className={styles.lineWrapSpan}
                                            variant="overline"
                                        >
                                            or with your email
                                        </Typography>
                                    </>
                                ) : null}
                                <RegisterForm
                                    submitRegister={this.onSubmitRegister}
                                    isClearForm={this.state.isClearForm}
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
                    <main>
                        <NotifierInline message="You seem to be offline. Register is disabled." />
                    </main>
                )}
            </>
        );
    }
}


RegisterHome.propTypes = {
    registerForm: PropTypes.any,
    actionPostAddress: PropTypes.func.isRequired,
    actionRegister: PropTypes.func.isRequired,
    actionSocialRegisterGoogle: PropTypes.func.isRequired,
    isOnline: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    errorAddress: PropTypes.any,
    dataAddress: PropTypes.any,
    errorSocial: PropTypes.any,
    dataGoogle: PropTypes.any,
    dataRegister: PropTypes.any,
    errorRegister: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.onlineStatus,
        ...state.register,
        registerForm: state.form.RegisterForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionSocialRegisterGoogle,
            actionRegister,
            actionPostAddress,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(RegisterHome));

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
