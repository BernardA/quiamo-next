import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { required, isEmail, isSpace } from '../tools/validator';
import { renderInput } from './formInputs';
import RenderPassword from './formRenderPassword';
import styles from '../styles/loginForm.module.scss';
import Link from '../components/link';
import { LANG } from '../parameters';

const trans = {
    br: {
        password: 'Senha',
        forgotPassword: 'esqueceu a senha',
        connect: 'Entrar',
    },
    en: {
        password: 'Password',
        forgotPassword: 'forgot password',
        connect: 'Connect',
    }
}

class LoginForm extends React.Component {
    render() {
        const {
            handleSubmit,
            invalid,
            submitting,
            error,
            submitLogin,
        } = this.props;
        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <form name="login_form" onSubmit={handleSubmit(submitLogin)}>
                <div className="form_input">
                    <Field
                        name="username"
                        type="e-mail"
                        label="Email"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                        variant="outlined"
                    />
                </div>

                <div className="form_input">
                    <Field
                        name="password"
                        label={trans[LANG].password}
                        variant="outlined"
                        component={RenderPassword}
                        validate={[required, isSpace]}
                    />
                </div>
                <div id="captcha" />
                <div className={styles.forgotPassword}>
                    <Link href="/password-recovery/request">{`${trans[LANG].forgotPassword}?`}</Link>
                </div>
                <Button
                    className={styles.button}
                    variant="contained"
                    fullWidth
                    color="primary"
                    disabled={submitting || invalid}
                    name="_submit"
                    type="submit"
                >
                    {trans[LANG].connect}
                </Button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitLogin: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: 'LoginForm',
})(LoginForm);
