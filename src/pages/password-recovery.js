import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Loading } from '../components/loading';
import PasswordRecoveryRequestForm from '../components/passwordRecoveryRequestForm';
import PasswordRecoveryResetForm from '../components/passwordRecoveryResetForm';
import NotifierInline from '../components/notifierInline';
import {
    actionPostUserConfirm,
    actionPostPasswordRecoveryRequest,
    actionPostPasswordRecoveryReset,
} from '../store/actions';
import styles from '../styles/passwordRecovery.module.scss';
import getCategories from '../lib/getCategories';


class PasswordRecovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            action: null,
            message: null,
            messageSeverity: 'info',
        };
    }

    componentDidMount() {
        const { router } = this.props;
        if (router.pathname === '/password-recovery') {
            this.setState({
                action: 'request',
                message: 'Please enter your email address',
            });
        } else {
            this.setState({ action: 'confirm' });
            const token = Router.replace('/password-recovery/');
            // check if token length === 30
            if (token.length !== 30) {
                this.setState({
                    message: 'Invalid token',
                    messageSeverity: 'danger',
                });
            }
            if (token && token.length === 30) {
                this.props.actionPostUserConfirm(token);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const {
            dataPasswordReset,
            dataConfirmation,
            errorConfirmation,
            errorReq,
            dataPasswordRequest,
            router,
        } = this.props;
        if (
            prevProps.dataPasswordRequest !== dataPasswordRequest &&
            dataPasswordRequest
        ) {
            this.setState({
                message: 'Please check your email and follow instructions. ',
                action: 'notifier',
                messageSeverity: 'success',
            });
        }
        if (
            prevProps.dataPasswordReset !== dataPasswordReset &&
            dataPasswordReset
        ) {
            this.setState({
                message: 'Password succesfully changed. You will be redirected to login',
                messageSeverity: 'success',
                action: 'notifier',
            });
            this.timeout = setTimeout(() => router.push('/login'), 5000);
        }
        if (
            prevProps.dataConfirmation !== dataConfirmation &&
            dataConfirmation
        ) {
            this.setState({ action: 'reset' });
        }
        if (
            prevProps.errorConfirmation !== errorConfirmation &&
            errorConfirmation
        ) {
            this.setState({
                message: 'Invalid token',
                messageSeverity: 'danger',
            });
        }
        if (!prevProps.errorReq && errorReq) {
            this.setState({
                message: errorReq[0].error,
                messageSeverity: 'danger',
            });
        }
    }

    handlePasswordRecoveryRequest = () => {
        const { values } = this.props.passwordRecoveryRequestForm;
        this.props.actionPostPasswordRecoveryRequest(values.emailRequest);
    };

    handlePasswordRecoveryReset = () => {
        const { values } = this.props.passwordRecoveryResetForm;
        values.id = this.props.dataConfirmation.id;
        this.props.actionPostPasswordRecoveryReset(values);
    };

    render() {
        const {
            isLoading,
            isLoadingConfirm,
        } = this.props;
        const { action, message, messageSeverity } = this.state;

        return (
            <>
                <main>
                    {isLoading || isLoadingConfirm ? <Loading /> : null}
                    <Card id="noShadow" className={styles.root}>
                        <CardHeader
                            className={styles.header}
                            title={(
                                <Typography
                                    className={styles.title}
                                    component="h3"
                                >
                                    Password reset
                                </Typography>
                            )}
                        />
                        <CardContent className={styles.content}>
                            {
                                message ?
                                    (
                                        <NotifierInline
                                            message={message}
                                            severity={messageSeverity}
                                            isNotClosable
                                        />
                                    )
                                    : null
                            }
                            {action === 'request' ? (
                                <PasswordRecoveryRequestForm
                                    handlePasswordRecoveryRequest={
                                        this.handlePasswordRecoveryRequest
                                    }
                                />
                            ) : null}
                            {action === 'reset' ? (
                                <PasswordRecoveryResetForm
                                    handlePasswordRecoveryReset={
                                        this.handlePasswordRecoveryReset
                                    }
                                />
                            ) : null}
                        </CardContent>
                    </Card>
                </main>
            </>
        );
    }
}

PasswordRecovery.propTypes = {
    actionPostUserConfirm: PropTypes.func.isRequired,
    actionPostPasswordRecoveryRequest: PropTypes.func.isRequired,
    actionPostPasswordRecoveryReset: PropTypes.func.isRequired,
    dataConfirmation: PropTypes.any,
    dataPasswordReset: PropTypes.any,
    dataPasswordRequest: PropTypes.any,
    errorConfirmation: PropTypes.any,
    errorReq: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    isLoadingConfirm: PropTypes.bool.isRequired,
    passwordRecoveryRequestForm: PropTypes.any,
    passwordRecoveryResetForm: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.password,
        isLoadingConfirm: state.register.isLoading,
        dataConfirmation: state.register.dataConfirmation,
        errorConfirmation: state.register.errorConfirmation,
        passwordRecoveryRequestForm: state.form.PasswordRecoveryRequestForm,
        passwordRecoveryResetForm: state.form.PasswordRecoveryResetForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostPasswordRecoveryRequest,
            actionPostPasswordRecoveryReset,
            actionPostUserConfirm,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PasswordRecovery);

export async function getStaticProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
