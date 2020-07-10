import React from 'react';
import { connect } from 'react-redux';
import {
    Field,
    reduxForm,
    formValueSelector,
    getFormMeta,
} from 'redux-form';
import { Button } from '@material-ui/core/';
import PropTypes from 'prop-types';
import {
    required, passwordReq, isMatchPassword, isSpace,
} from '../tools/validator';
import RenderPassword from './formRenderPassword';
import PasswordStrength from './passwordStrength';

const isMatchPlainPassword = isMatchPassword('newPassword');

class PasswordRecoveryResetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivePlainPassword: false,
        };
    }

    componentDidUpdate(prevProps) {
        const { fields } = this.props;
        if (prevProps.fields !== fields) {
            let isActivePlainPassword = false;
            if (
                fields &&
                fields.newPassword &&
                fields.newPassword.active
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
            handlePasswordRecoveryReset,
            error,
            plainPassword,
        } = this.props;

        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <form
                name="password_recovery_reset_form"
                onSubmit={handleSubmit(handlePasswordRecoveryReset)}
            >
                <div className="form_input">
                    <Field
                        name="newPassword"
                        placeholder="new password"
                        label="New password"
                        component={RenderPassword}
                        variant="outlined"
                        autoComplete="off"
                        validate={[required, passwordReq, isSpace]}
                    />
                    <PasswordStrength
                        plainPassword={plainPassword}
                        isActivePlainPassword={this.state.isActivePlainPassword}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="newPasswordConfirmation"
                        label="New password - confirmation"
                        placeholder="new password confirmation"
                        component={RenderPassword}
                        variant="outlined"
                        validate={[required, isMatchPlainPassword]}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={submitting || invalid}
                        name="_submit"
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
}

PasswordRecoveryResetForm.propTypes = {
    error: PropTypes.object,
    handlePasswordRecoveryReset: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    plainPassword: PropTypes.any,
};

const selector = formValueSelector('PasswordRecoveryResetForm');

export default connect(
    (state) => {
        const plainPassword = selector(state, 'newPassword');
        const fields = getFormMeta('PasswordRecoveryResetForm')(state);
        return {
            plainPassword,
            fields,
        };
    },
)(reduxForm({
    form: 'PasswordRecoveryResetForm',
})(PasswordRecoveryResetForm));
