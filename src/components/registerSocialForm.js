import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { Button, FormGroup } from '@material-ui/core/';
import PropTypes from 'prop-types';
import {
    required,
    minLength,
    maxLength,
    isOnlySpace,
    isSpace,
} from '../tools/validator';
import { renderInput } from './formInputs';


// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows

const maxLength180 = maxLength(180);
const maxLength50 = maxLength(50);
const minLength8 = minLength(8);
const minLength5 = minLength(5);

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
});

class RegisterSocialForm extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.isClearForm && this.props.isClearForm) {
            this.props.reset();
        }
    }

    render() {
        const {
            classes,
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            submitRegister,
            hasUsername,
        } = this.props;

        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <form
                name="social_registration_form"
                onSubmit={handleSubmit(submitRegister)}
            >
                {!hasUsername ? (
                    <div className="form_input">
                        <Field
                            name="username"
                            type="text"
                            className={classes.textField}
                            label="Username"
                            variant="outlined"
                            component={renderInput}
                            validate={[required, minLength8, maxLength50, isSpace]}
                        />
                    </div>
                ) : null}
                <div className="form_input">
                    <Field
                        name="address1"
                        type="text"
                        className={classes.textField}
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
                        className={classes.textField}
                        label="Street"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, minLength8, maxLength180, isOnlySpace]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address3"
                        type="text"
                        id="address3"
                        className={classes.textField}
                        label="Complement of address"
                        variant="outlined"
                        component={renderInput}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="city"
                        type="text"
                        className={classes.textField}
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
                        className={classes.textField}
                        label="Postal code"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, minLength5, isOnlySpace]}
                    />
                </div>
                <div id="captcha_signup" />
                <div className="form_input form_submit">
                    <FormGroup row>
                        <Button
                            className={classes.button}
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

RegisterSocialForm.propTypes = {
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    submitRegister: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    hasUsername: PropTypes.bool.isRequired,
    isClearForm: PropTypes.bool.isRequired,
};

const decorated = withStyles(styles)(RegisterSocialForm);

export default reduxForm({
    form: 'RegisterSocialForm',
})(decorated);
