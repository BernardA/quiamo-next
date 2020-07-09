import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import {
    required, minLengthWithoutHTML, maxLength, minValue, isNumber,
} from '../tools/validator';
import { renderInput, renderRadio } from './formInputs';
import RenderSelect from './formInputRenderSelect';
import AutocompleteGrouped from './formInputAutocompleteGrouped';
import { LoadingVisibility } from './loading';
import { ROOT_CATEGORIES } from '../parameters';

const minValue0 = minValue(0);
const minValue1 = minValue(1);
const maxLength300 = maxLength(300);
const minLengthWithoutHTML25 = minLengthWithoutHTML(25);

const styles = () => ({
    progress: {
        height: '10px',
    },
});

const TextEditor = dynamic(() => import('./textEditor'), {
    ssr: false,
    loading: LoadingVisibility,
});



class AdInsertForm extends React.Component {
    componentDidUpdate(prevProps) {
        const { isClearForm, adType } = this.props;
        if (isClearForm !== prevProps.isClearForm && isClearForm) {
            this.resetForm();
        }
        if (prevProps.adType !== adType) {
            this.handleTypeRadioChange();
        }
    }

    handleTypeRadioChange = () => {
        const categoryInput = document.querySelector('#category');
        if (categoryInput.value !== '') {
            const categoryClear = document.getElementsByClassName(
                'MuiAutocomplete-clearIndicator',
            );
            if (categoryClear.length > 0) {
                categoryClear[0].click();
            }
        }
        // const editor = document.getElementsByClassName('ql-editor');
        categoryInput.focus();
        this.resetForm();
    }

    resetForm = () => {
        const { adType, change } = this.props;
        const categoryClear = document.getElementsByClassName('MuiAutocomplete-clearIndicator');
        categoryClear[0].click();
        this.props.reset();
        const editor = document.getElementsByClassName('ql-editor');
        editor[0].focus();
        const progressBar = document.getElementById('description_progression');
        progressBar.style.width = '0%';
        change('adType', adType);
    }

    handleSetBudgetTypeSelect = () => {
        const { buyOrRent } = this.props;
        const budgetTypesService = [
            { value: '', label: 'Select' },
            { value: 'hour', label: 'per hour' },
            { value: 'day', label: 'per day' },
            { value: 'global', label: 'global' },
            { value: 'quote', label: 'quote' },
            { value: 'free', label: 'free' },
        ];
        const budgetTypesProductBuy = [
            { value: '', label: 'Select' },
            { value: 'global', label: 'global' },
            { value: 'quote', label: 'quote' },
            { value: 'free', label: 'donation' },
        ];
        const budgetTypesProductRent = [
            { value: '', label: 'Select' },
            { value: 'hour', label: 'per hour' },
            { value: 'day', label: 'per day' },
            { value: 'free', label: 'loan' },
        ];
        let types = budgetTypesService;
        if (buyOrRent && buyOrRent === 'rent') {
            types = budgetTypesProductRent;
        } else if (buyOrRent && buyOrRent === 'buy') {
            types = budgetTypesProductBuy;
        }
        return types.map((option) => {
            return (
                <MenuItem
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </MenuItem>
            );
        });
    }

    render() {
        const main = ROOT_CATEGORIES.split(',');
        const {
            classes,
            handleSubmit,
            submitting,
            invalid,
            error,
            pristine,
            submitAdInsert,
            adType,
            buyOrRent,
            budgetType,
            categories,
        } = this.props;
        if (error) {
            return (
                <div>{error.messageKey}</div>
            );
        }
        return (
            <form
                // name="ad_insert_form"
                onSubmit={handleSubmit(submitAdInsert)}
            >
                <div className="form_input">
                    <Field
                        name="adType"
                        type="radio"
                        component={renderRadio}
                        validate={[required]}
                        row
                        options={[
                            { title: main[0], id: main[0], value: main[0] },
                            { title: main[1], id: main[1], value: main[1] },
                        ]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="category"
                        id="category"
                        type="text"
                        variant="outlined"
                        label="Category"
                        selectedTypeRadio={adType}
                        categories={categories}
                        component={AutocompleteGrouped}
                        disabled={adType === undefined}
                        validate={[required]}
                    />
                    <span id="no_cat_search" className="form_error" />
                </div>
                <div className="form_input">
                    <Field
                        name="description"
                        id="description"
                        label="Description"
                        onFocus={
                            () => { document.getElementById('description_indication').style.display = 'block'; }
                        }
                        onBlur={
                            () => { document.getElementById('description_indication').style.display = 'none'; }
                        }
                        component={TextEditor}
                        validate={[required, minLengthWithoutHTML25, maxLength300]}
                        variant="outlined"
                    />
                    <div id="description_indication" className="form_input">
                        <div>
                            <div id="description_progression" className={classes.progress} />
                        </div>
                    </div>
                </div>
                {adType === main[0] ? (
                    <div className="form_input" id="buyOrRent">
                        <Field
                            name="buyOrRent"
                            type="radio"
                            row
                            component={renderRadio}
                            validate={[required]}
                            options={[
                                { title: 'Buy', id: 'buy', value: 'buy' },
                                { title: 'Rent', id: 'rent', value: 'rent' },
                            ]}
                        />
                    </div>
                ) : ''}
                <div className="form_input form_select">
                    <Field
                        name="budgetType"
                        type="select"
                        id="budgetType"
                        validate={[required]}
                        component={RenderSelect}
                        variant="outlined"
                        label="Budget type"
                    >
                        {this.handleSetBudgetTypeSelect()}
                    </Field>
                </div>
                {buyOrRent === 'rent' && budgetType === 'day' ? (
                    <div className="form_input">
                        <Field
                            name="rent_time"
                            type="number"
                            id="rent_time"
                            validate={[required, minValue1]}
                            label="Rent time in days"
                            component={renderInput}
                            variant="outlined"
                        />
                    </div>
                )
                    : null}
                { (adType === main[0] && buyOrRent === 'buy' && budgetType === 'global') ||
                    (adType === main[1] && (budgetType === 'hour' || budgetType === 'day' || budgetType === 'global')) ? (
                        <div className="form_input">
                            <Field
                                name="budget"
                                type="number"
                                id="budget"
                                label="Budget"
                                component={renderInput}
                                validate={[isNumber, minValue0, required]}
                                variant="outlined"
                            />
                        </div>
                    )
                    : null}
                {buyOrRent === 'rent' && budgetType === 'day' ? (
                    <div className="form_input">
                        <Field
                            name="budget"
                            type="number"
                            id="budget"
                            label="Budget/day"
                            component={renderInput}
                            validate={[isNumber, minValue0, required]}
                            variant="outlined"
                        />
                    </div>
                ) : null}
                <div className="form_input form_submit">
                    <FormGroup
                        row
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            name="_submit"
                            type="submit"
                            disabled={submitting || invalid}
                        >
                            Submit
                        </Button>
                        <Button
                            disabled={pristine || submitting}
                            onClick={this.resetForm}
                            variant="outlined"
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

AdInsertForm.propTypes = {
    error: PropTypes.any,
    isClearForm: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitAdInsert: PropTypes.func.isRequired,
    adType: PropTypes.string,
    buyOrRent: PropTypes.string,
    budgetType: PropTypes.string,
    classes: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    change: PropTypes.func.isRequired,
};


const selector = formValueSelector('AdInsertForm');
export default connect(
    (state) => {
        const { adType, buyOrRent, budgetType } = selector(state, 'adType', 'buyOrRent', 'budgetType');
        return {
            adType,
            buyOrRent,
            budgetType,
        };
    },
)(reduxForm({
    form: 'AdInsertForm',
})(withStyles(styles)(AdInsertForm)));
