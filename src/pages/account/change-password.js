/* eslint-disable no-class-assign */
import React from 'react';
import {
    Field, reduxForm, formValueSelector, getFormMeta,
} from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import { withRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import {
    required,
    isSpace,
    passwordReq,
    isMatchPassword,
} from '../../tools/validator';
import RenderPassword from '../../components/formRenderPassword';
import { actionPutPasswordReset } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import PasswordStrength from '../../components/passwordStrength';
import Breadcrumb from '../../components/breadcrumb';
import { Loading } from '../../components/loading';
import styles from '../../styles/login.module.scss';
import getCategories from '../../lib/getCategories';
import { handlePrivateRoute } from '../../tools/functions';

// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows


const isMatchPlainPassword = isMatchPassword('newPassword');

class PasswordChangeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivePlainPassword: false,
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
            errorPasswordReset, dataPasswordReset, reset, fields,
        } = this.props;
        if (prevProps.errorPasswordReset !== errorPasswordReset && errorPasswordReset) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct errors below.',
                    errors: errorPasswordReset,
                },
            });
        }
        if (prevProps.dataPasswordReset !== dataPasswordReset && dataPasswordReset) {
            reset();
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your changes were processed.',
                    errors: {},
                },
            });
        }
        if (prevProps.fields !== fields) {
            let isActivePlainPassword = false;
            if (fields && fields.newPassword && fields.newPassword.active) {
                isActivePlainPassword = true;
            }
            this.setState({ isActivePlainPassword });
        }
    }

    handleSubmitPasswordChange = () => {
        const values = this.props.passwordChangeForm.values;
        values.userId = this.props.cookies.get('userId');
        this.props.actionPutPasswordReset(values);
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

        if (this.props.dataPasswordReset) {
            this.props.router.push('/account');
        }
    };

    render() {
        const {
            handleSubmit,
            invalid,
            submitting,
            error,
            pristine,
            reset,
            isLoading,
            plainPassword,
        } = this.props;
        return (
            <main>
                {isLoading ? <Loading /> : null}
                <Breadcrumb links={[
                    { href: '/account', text: 'account' },
                    { href: null, text: 'change-password' },
                ]}
                />
                <Card id="noShadow" className={styles.root}>
                    <CardHeader
                        className={styles.header}
                        title={(
                            <Typography className={styles.title} component="h3">
                                Password change
                            </Typography>
                        )}
                    />
                    <CardContent className={styles.content}>
                        {error ? (
                            <div>{error.messageKey}</div>
                        ) : (
                            <form
                                name="address_form"
                                onSubmit={handleSubmit(
                                    this.handleSubmitPasswordChange,
                                )}
                            >
                                <div className="form_input">
                                    <Field
                                        name="oldPassword"
                                        label="Current Password"
                                        variant="outlined"
                                        component={RenderPassword}
                                        validate={[isSpace]}
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="newPassword"
                                        label="Password"
                                        variant="outlined"
                                        component={RenderPassword}
                                        validate={[
                                            required,
                                            passwordReq,
                                            isSpace,
                                        ]}
                                    />
                                    <PasswordStrength
                                        plainPassword={plainPassword}
                                        isActivePlainPassword={
                                            this.state.isActivePlainPassword
                                        }
                                    />
                                </div>
                                <div className="form_input">
                                    <Field
                                        name="newPasswordConfirmation"
                                        label="Password confirmation"
                                        variant="outlined"
                                        component={RenderPassword}
                                        validate={[
                                            isMatchPlainPassword,
                                        ]}
                                    />
                                </div>
                                <div className="form_input form_submit">
                                    <FormGroup row>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            name="_submit"
                                            type="submit"
                                            disabled={submitting || invalid}
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            disabled={pristine || submitting}
                                            onClick={reset}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Clear
                                        </Button>
                                    </FormGroup>
                                </div>
                            </form>
                        )}
                        <NotifierDialog
                            notification={this.state.notification}
                            handleNotificationDismiss={
                                this.handleNotificationDismiss
                            }
                        />
                    </CardContent>
                </Card>
            </main>
        );
    }
}

PasswordChangeForm.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    passwordChangeForm: PropTypes.any,
    actionPutPasswordReset: PropTypes.func.isRequired,
    errorPasswordReset: PropTypes.any,
    dataPasswordReset: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    plainPassword: PropTypes.any,
    fields: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
};

const selector = formValueSelector('passwordChangeForm');

const mapStateToProps = (state) => {
    const plainPassword = selector(state, 'newPassword');
    const fields = getFormMeta('passwordChangeForm')(state);
    return {
        plainPassword,
        fields,
        ...state.account,
        passwordChangeForm: state.form.passwordChangeForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPutPasswordReset,
        },
        dispatch,
    );
}

PasswordChangeForm = reduxForm({
    form: 'passwordChangeForm',
})(PasswordChangeForm);

PasswordChangeForm = withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(PasswordChangeForm)));

export default PasswordChangeForm;

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