import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
    FormGroup,
    Button,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import {
    required, minLength, maxLength, isOnlySpace,
} from '../tools/validator';
import { renderInput } from './formInputs';

// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows

const maxLength180 = maxLength(180);
const maxLength50 = maxLength(50);
const minLength5 = minLength(5);
const minLength8 = minLength(8);

class UserAddressChangeForm extends React.Component {
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
            handleSubmitAddressChange,
        } = this.props;
        return (
            <>
                {error ? (
                    <div>{error.messageKey}</div>
                ) : (
                    <form
                        name="address_form"
                        onSubmit={handleSubmit(
                            handleSubmitAddressChange,
                        )}
                    >
                        <div className="form_input">
                            <Field
                                name="address1"
                                type="text"
                                placeholder="Street number"
                                component={renderInput}
                                validate={[
                                    required,
                                    maxLength50,
                                    isOnlySpace,
                                ]}
                                autoFocus
                                variant="outlined"
                                label="Street number"
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="address2"
                                type="text"
                                placeholder="Street"
                                component={renderInput}
                                variant="outlined"
                                label="Street"
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
                                placeholder="Complement of address"
                                component={renderInput}
                                variant="outlined"
                                label="Complement of address"
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="city"
                                type="text"
                                placeholder="City"
                                component={renderInput}
                                validate={[required, isOnlySpace]}
                                variant="outlined"
                                label="City"
                            />
                        </div>
                        <div className="form_input">
                            <Field
                                name="postalCode"
                                type="text"
                                placeholder="Postal code"
                                component={renderInput}
                                validate={[
                                    required,
                                    minLength5,
                                    isOnlySpace,
                                ]}
                                variant="outlined"
                                label="Postal code"
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

UserAddressChangeForm.propTypes = {
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleSubmitAddressChange: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    isResetForm: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: 'UserAddressChangeForm',
})(UserAddressChangeForm);
