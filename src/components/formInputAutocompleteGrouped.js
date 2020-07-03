/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ROOT_CATEGORIES } from '../parameters';

const styles = () => ({
    option: {
        marginLeft: '20px',
    },
});

function AutocompleteGrouped(field) {
    const {
        classes,
        categories,
        selectedTypeRadio,
        meta: { touched, error },
    } = field;
    const options = [];
    if (selectedTypeRadio) {
        categories.forEach((cat) => {
            if (cat.root && cat.root.title === selectedTypeRadio &&
                cat.parent.title === selectedTypeRadio) {
                const category = cat.title;
                categories.forEach((cat1) => {
                    if (cat1.root && cat1.root.title === selectedTypeRadio &&
                        cat1.parent.title === category) {
                        options.push({ category, ...cat1 });
                    }
                });
            }
        });
    } else {
        const main = ROOT_CATEGORIES.split(',');
        main.forEach((type) => {
            categories.forEach((cat) => {
                const category = cat.title;
                if (!cat.root && !cat.parent && category === type) {
                    categories.forEach((cat1) => {
                        if (cat1.root && cat1.root.title === type &&
                            cat1.parent.title === type) {
                            options.push({ category: type, title: cat1.title });
                        }
                    });
                }
            });
        });
    }
    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        ignoreAccents: true,
        stringify: (option) => option.title,
    });
    return (
        <Autocomplete
            filterOptions={filterOptions}
            classes={{ option: classes.option }}
            id={field.id}
            options={options.sort((a, b) => `${a.category}${a.title}`.localeCompare(`${b.category}${b.title}`))}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.title}
            onChange={(event, value) => console.log(value)}
            getOptionSelected={(option, value) => option.title === value.title}
            disabled={field.disabled}
            renderInput={(params) => (
                <>
                    <TextField
                        {...params}
                        fullWidth
                        type={field.type}
                        id={field.id}
                        label={field.label}
                        helperText={field.helperText}
                        onKeyUp={field.onKeyUp}
                        onChange={field.onChange}
                        className={field.className}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        // autoFocus={field.autoFocus}
                        {...field.input}
                        variant={field.variant}
                    />
                    <span className="form_error">{touched ? error : ''}</span>
                </>
            )}
        />
    );
}

AutocompleteGrouped.propTypes = {
    categories: PropTypes.array.isRequired,
};

export default withStyles(styles)(AutocompleteGrouped);
