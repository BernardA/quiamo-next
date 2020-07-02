import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Visibility } from '@material-ui/icons';
import { InputAdornment, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { actionToggleVisiblePassword } from '../store/actions';

class RenderPassword extends React.Component {
    componentDidUpdate(prevProps) {
        const { isPasswordMasked } = this.props;
        if (prevProps.isPasswordMasked !== isPasswordMasked) {
            const redeye = document.getElementsByClassName(
                'toggleVisiblePassword',
            );
            if (!isPasswordMasked) {
                Array.prototype.forEach.call(redeye, (eye) => {
                    // eslint-disable-next-line no-param-reassign
                    eye.style.color = 'red';
                });
            } else {
                Array.prototype.forEach.call(redeye, (eye) => {
                    // eslint-disable-next-line no-param-reassign
                    eye.style.color = 'rgba(0, 0, 0, 0.87)';
                });
            }
        }
    }

    componentWillUnmount() {
        // reset password to the masked state
        if (!this.props.isPasswordMasked) {
            this.props.actionToggleVisiblePassword();
        }
    }

    handleToggleVisiblePassword = () => {
        this.props.actionToggleVisiblePassword();
    };

    render() {
        const {
            meta: { touched, error, warning },
            isPasswordMasked,
        } = this.props;
        return (
            <>
                <TextField
                    type={isPasswordMasked ? 'password' : 'text'}
                    id={this.props.id}
                    label={this.props.label}
                    margin="none"
                    helperText={this.props.helperText}
                    fullWidth
                    onKeyUp={this.props.onKeyUp}
                    className={this.props.className}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    autoFocus={this.props.autoFocus}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...this.props.input}
                    variant={this.props.variant}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Visibility
                                    onClick={this.handleToggleVisiblePassword}
                                    className="pointer toggleVisiblePassword"
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                <span className="form_error">{touched ? error : ''}</span>
                <span className="form_warning">{touched ? warning : ''}</span>
            </>
        );
    }
}

RenderPassword.propTypes = {
    meta: PropTypes.object.isRequired,
    id: PropTypes.any,
    label: PropTypes.any,
    helperText: PropTypes.any,
    onKeyUp: PropTypes.any,
    className: PropTypes.any,
    placeholder: PropTypes.any,
    disabled: PropTypes.any,
    autoFocus: PropTypes.any,
    input: PropTypes.any,
    variant: PropTypes.any,
    isPasswordMasked: PropTypes.bool.isRequired,
    actionToggleVisiblePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.password,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionToggleVisiblePassword,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderPassword);
