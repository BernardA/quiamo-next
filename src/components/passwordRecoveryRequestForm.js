import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required, isEmail } from '../tools/validator';
import { renderInput } from './formInputs';

class PasswordRecoveryRequestForm extends React.Component {
    render() {
        const {
            handleSubmit,
            invalid,
            submitting,
            error,
            handlePasswordRecoveryRequest,
        } = this.props;

        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <form
                name="password_recovery_request_form"
                onSubmit={handleSubmit(handlePasswordRecoveryRequest)}
            >
                <div className="form_input">
                    <Field
                        name="emailRequest"
                        type="e-mail"
                        label="Email"
                        placeholder="e-mail"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                        variant="outlined"
                    />
                </div>
                <div className="form_input">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={submitting || invalid}
                        name="_submit"
                        type="submit"
                        fullWidth
                    >
                        Send request
                    </Button>
                </div>
            </form>
        );
    }
}

PasswordRecoveryRequestForm.propTypes = {
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handlePasswordRecoveryRequest: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'PasswordRecoveryRequestForm',
})(PasswordRecoveryRequestForm);
