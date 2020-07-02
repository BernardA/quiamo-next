/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import SocialLogin from 'react-social-login';
import { ButtonBase }from '@material-ui/core/';
import PropTypes from 'prop-types';

const Button = ({ children, triggerLogin, ...props }) => (
    <ButtonBase onClick={triggerLogin} {...props}>
        {children}
    </ButtonBase>
);

Button.propTypes = {
    children: PropTypes.object.isRequired,
    triggerLogin: PropTypes.func.isRequired,
};

export default SocialLogin(Button);
