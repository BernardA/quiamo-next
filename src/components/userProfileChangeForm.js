import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
    FormGroup,
    Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
    required,
    maxLength,
    isOnlySpace,
    isEmail,
} from '../tools/validator';
import { renderInput } from './formInputs';

const maxLength50 = maxLength(50);

class UserProfileChangeForm extends React.Component {
    componentDidMount() {
        const {
            isSocialLogin,
            change,
            userProfile,
        } = this.props;
        change('email', userProfile.email);
        // block change of email if social login
        if (isSocialLogin) {
            document.getElementById('emailInput').type = 'hidden';
            document.getElementById('emailContainer').style.opacity = 0;
        }
    }

    componentDidUpdate(prevProps) {
        const { isResetForm, reset } = this.props;
        if (prevProps.isResetForm !== isResetForm && isResetForm) {
            reset();
        }
    }

    render() {
        const {
            handleSubmit,
            invalid,
            submitting,
            error,
            pristine,
            reset,
            handleSubmitProfileChange,
        } = this.props;

        return (
            <>
                {error ? (
                    <div>{error.messageKey}</div>
                ) : (
                    <form
                        name="profile_form"
                        onSubmit={handleSubmit(
                            handleSubmitProfileChange,
                        )}
                    >
                        <div className="form_input">
                            <Field
                                name="name"
                                type="text"
                                placeholder="Name"
                                component={renderInput}
                                validate={[
                                    required,
                                    maxLength50,
                                    isOnlySpace,
                                ]}
                                autoFocus
                                variant="outlined"
                                label="Name"
                            />
                        </div>
                        <div id="emailContainer" className="form_input">
                            <Field
                                name="email"
                                type="e-mail"
                                id="emailInput"
                                label="Email"
                                variant="outlined"
                                component={renderInput}
                                validate={[required, isEmail]}
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
            </>
        );
    }
}

UserProfileChangeForm.propTypes = {
    handleSubmitProfileChange: PropTypes.func.isRequired,
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    isSocialLogin: PropTypes.bool.isRequired,
    isResetForm: PropTypes.bool.isRequired,
    userProfile: PropTypes.object.isRequired,
};

export default reduxForm({
    form: 'UserProfileChangeForm',
})(UserProfileChangeForm);