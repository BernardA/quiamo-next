/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    formControl: {
        minWidth: 120,
        display: 'grid',
        width: '100%',
        '& label': {
            marginLeft: '14px',
        },
    },
    selectEmpty: {
        marginTop: theme.spacing(1) * 2,
    },
});

class RenderSelect extends React.Component {
    render() {
        const {
            classes,
            id,
            input,
            label,
            disabled,
            helperText,
            meta: { touched, error },
            children,
            placeholder,
            ...custom
        } = this.props;
        return (
            <>
                <FormControl className={classes.formControl}>
                    <InputLabel className={classes.label} htmlFor={id}>{label}</InputLabel>
                    <Select
                        id={id}
                        placeholder={placeholder}
                        {...input}
                        onChange={(value) => input.onChange(value)}
                        {...custom}
                    >
                        {children}
                    </Select>

                    <FormHelperText>{helperText}</FormHelperText>
                    <span className="form_error">{touched ? error : ''}</span>
                </FormControl>
            </>
        );
    }
}

RenderSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.any,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
    placeholder: PropTypes.any,
};


export default withStyles(styles)(RenderSelect);
