import React from 'react';
import { connect } from 'react-redux';
import {
    Field, reduxForm, formValueSelector, getFormMeta,
} from 'redux-form';
import { 
    Button,
    FormGroup,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import {
    required,
    minLength,
    maxLength,
    isEmail,
    isMatchPassword,
    isSpace,
    isOnlySpace,
    passwordReq,
} from '../tools/validator';
import { renderInput } from './formInputs';
import RenderPassword from './formRenderPassword';
import PasswordStrength from './passwordStrength';
import styles from '../styles/registerForm.module.scss';


// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows

const maxLength180 = maxLength(180);
const maxLength50 = maxLength(50);
const minLength8 = minLength(8);
const minLength5 = minLength(5);
const minLength10 = minLength(10);
const isMatchPlainPassword = isMatchPassword('password');

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivePlainPassword: false,
        };
    }

    componentDidUpdate(prevProps) {
        const { isClearForm, fields } = this.props;
        if (!prevProps.isClearForm && isClearForm) {
            this.props.reset();
        }
        if (prevProps.fields !== fields) {
            let isActivePlainPassword = false;
            if (
                fields && fields.password &&
                fields.password.active
            ) {
                isActivePlainPassword = true;
            }
            this.setState({ isActivePlainPassword });
        }
    }

    render() {
        const {
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            submitRegister,
            plainPassword,
        } = this.props;

        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <form
                name="user_registration_form"
                onSubmit={handleSubmit(submitRegister)}
            >
                <div className="form_input">
                    <Field
                        name="email"
                        type="e-mail"
                        id="outlined-email"
                        label="Email"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="username"
                        type="text"
                        id="outlined-username"
                        label="Username"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, minLength10, maxLength50, isSpace]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="password"
                        id="outlined-password"
                        label="Password"
                        variant="outlined"
                        component={RenderPassword}
                        validate={[required, passwordReq, isSpace]}
                    />
                    <PasswordStrength
                        plainPassword={plainPassword}
                        isActivePlainPassword={this.state.isActivePlainPassword}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="passwordConfirmation"
                        id="outlined-password_confirmation"
                        label="Password confirmation"
                        variant="outlined"
                        component={RenderPassword}
                        validate={[required, isMatchPlainPassword]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address1"
                        type="text"
                        label="Street number"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, maxLength50, isOnlySpace]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address2"
                        type="text"
                        id="outlined-address2"
                        label="Street"
                        variant="outlined"
                        component={renderInput}
                        validate={[
                            required,
                            minLength8,
                            maxLength180,
                            isOnlySpace,
                        ]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address3"
                        type="text"
                        id="address3"
                        label="Complement of address"
                        variant="outlined"
                        component={renderInput}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="city"
                        type="text"
                        id="outlined-city"
                        label="City"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, isOnlySpace]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="postalCode"
                        type="text"
                        id="postalCode"
                        label="Postal code"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, minLength5, isOnlySpace]}
                    />
                </div>
                <div id="captcha_signup" />
                <div className="form_input form_submit">
                    <FormGroup className={styles.buttonContainer} row>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={submitting || invalid}
                            name="_submit"
                            type="submit"
                        >
                            Register
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
        );
    }
}

RegisterForm.propTypes = {
    error: PropTypes.any,
    submitRegister: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    isClearForm: PropTypes.bool.isRequired,
    plainPassword: PropTypes.any,
    fields: PropTypes.object.isRequired,
};

const selector = formValueSelector('RegisterForm');

export default connect(
    (state) => {
        const plainPassword = selector(state, 'password');
        const fields = getFormMeta('RegisterForm')(state);
        return {
            plainPassword,
            fields,
        };
    },
)(reduxForm({
    form: 'RegisterForm',
})(RegisterForm));
