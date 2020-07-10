import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geocode from 'react-geocode';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import localforage from 'localforage';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import RegisterSocialForm from '../../components/registerSocialForm';
import NotifierDialog from '../../components/notifierDialog';
import NotifierInline from '../../components/notifierInline';
import {
    actionPostAddress,
    actionPutRegisterSocial,
    actionPutUserToAd,
} from '../../store/actions';
import styles from '../../styles/register.module.scss';
import getCategories from '../../lib/getCategories';

class RegisterSocial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasUsername: false,
            isClearForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        if (this.props.dataGoogle) {
            const { dataGoogle: { username } } = this.props;
            this.setState({
                hasUsername: username && !username.includes('google'),
            });
        }
    }

    componentDidUpdate(prevProps) {
        const {
            dataAddress,
            token,
            errorAddress,
            errorPutSocial,
        } = this.props;

        if (prevProps.errorAddress !== errorAddress && errorAddress) {
            this.handleAddressError(errorAddress);
        }
        if (prevProps.dataAddress !== dataAddress && dataAddress) {
            this.handleAddressOk(dataAddress);
        }
        if (prevProps.errorPutSocial !== errorPutSocial && errorPutSocial) {
            this.handlePutSocialError(errorPutSocial);
        }
        if (prevProps.token !== token && token) {
            this.handlePutSocialOk();
        }
    }

    onSubmitRegister = () => {
        const values = this.props.registerSocialForm.values;
        // get coordinates
        const address = `${values.address1} ${values.address2} ${
            values.city} ${values.postalCode} Brasil`;
        Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
        Geocode.fromAddress(address).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                values.lat = lat;
                values.lng = lng;
                this.props.actionPostAddress(values);
            },
        ).catch(() => {
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

    handleAddressOk = (data) => {
        const values = this.props.registerSocialForm.values;
        values.address = data.address.id;
        values.id = this.props.dataGoogle.id;
        this.props.actionPutRegisterSocial(values);
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

    handlePutSocialOk = () => {
        const {
            router,
        } = this.props;
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
                            {`You will be redirected to homepage`}
                        </Typography>
                    </>
                );
            };
            this.setState({
                isClearForm: true,
                notification: {
                    status: 'ok',
                    title: 'You are now registered and logged in.',
                    message: message(),
                    errors: {},
                },
            });
            setTimeout(() => {
                router.push('/');
            }, 3000);
        });
    }

    handlePutSocialError = (errors) => {
        this.setState({
            notification: {
                status: 'error',
                title: 'There was an error.',
                message:
                    'Please review the following:',
                errors,
            },
        });
    }

    handleOffline = () => {
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
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    render() {
        const {
            isLoading, isOnline, dataGoogle,
        } = this.props;
        if (isOnline && !dataGoogle) {
            return (
                <>
                    <main>
                        <NotifierInline
                            message="Prior social registration is required to access this page."
                            isNotClosable
                        />
                    </main>
                </>
            );
        }
        return (
            <>
                <main>
                    {isOnline ? (
                        <>
                            {isLoading ? <Loading /> : null}
                            <Card id="noShadow" className={styles.root}>
                                <CardHeader
                                    className={styles.header}
                                    title={(
                                        <Typography
                                            className={styles.title}
                                            component="h3"
                                        >
                                            Register - supplement
                                        </Typography>
                                    )}
                                    subheader={(
                                        <Typography
                                            className={styles.subheader}
                                            color="textSecondary"
                                            variant="body2"
                                        >
                                            please provide required info below
                                        </Typography>
                                    )}
                                />
                                <CardContent className={styles.content}>
                                    <p>{this.state.isUserName}</p>
                                    <RegisterSocialForm
                                        submitRegister={this.onSubmitRegister}
                                        hasUsername={this.state.hasUsername}
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
                        </>
                    ) : (
                        <NotifierInline message="You seem to be offline. Register is disabled." />
                    )}
                </main>
            </>
        );
    }
}

RegisterSocial.propTypes = {
    registerSocialForm: PropTypes.any,
    dataGoogle: PropTypes.any,
    actionPostAddress: PropTypes.func.isRequired,
    actionPutRegisterSocial: PropTypes.func.isRequired,
    actionPutUserToAd: PropTypes.func.isRequired,
    isOnline: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dataAddress: PropTypes.any,
    token: PropTypes.any,
    errorAddress: PropTypes.any,
    errorPutSocial: PropTypes.any,
    username: PropTypes.any,
    userId: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.register,
        ...state.onlineStatus,
        token: state.auth.token,
        username: state.auth.username,
        userId: state.auth.userId,
        roles: state.auth.roles,
        registerSocialForm: state.form.RegisterSocialForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostAddress,
            actionPutRegisterSocial,
            actionPutUserToAd,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(RegisterSocial));

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
