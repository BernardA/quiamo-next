import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import {
    minLengthWithoutHTML, maxLength, minValue, isNumber,
} from '../tools/validator';
import { renderInput, renderRadio } from './formInputs';
import RenderSelect from './formInputRenderSelect';
import NotifierDialog from './notifierDialog';
import { actionPutAd } from '../store/actions';
import { Loading } from './loading';

const minValue0 = minValue(0);
const maxLength300 = maxLength(300);
const minLengthWithoutHTML25 = minLengthWithoutHTML(25);

const styles = () => ({
    progress: {
        height: '10px',
    },
});

const TextEditor = dynamic(() => import('./textEditor'), {
    ssr: false,
    loading: Loading,
});


class AdEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const main = process.env.ROOT_CATEGORIES.split(',');
        const { ad, change } = this.props;
        change('description', ad.description);
        if (ad.budget) {
            change('budget', ad.budget);
        }
        if (ad.category.root.title === main[1]) {
            change('budgetType', ad.budgetType);
        } else if (ad.category.root.title === main[0] && ad.rentTime) {
            change('rentTime', ad.rentTime);
        }
    }

    componentDidUpdate(prevProps) {
        const { adEditForm, dataPutAd } = this.props;
        if (prevProps.adEditForm && adEditForm &&
            (prevProps.adEditForm.values && adEditForm.values) &&
            (prevProps.adEditForm.values.description !==
            adEditForm.values.description) &&
            adEditForm.values.description) {
            this.handleDescriptionChange();
        }
        if (!prevProps.dataPutAd && dataPutAd) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success',
                    message: 'Ad was modified',
                    errors: {},
                },
            });
        }
    }

    handleDescriptionChange = () => {
        const typed = this.props.adEditForm.values.description.replace(
            /<\/?[a-z][a-z0-9]*[^<>]*>/gi,
            '',
        );
        const minLength = 25;
        const progress = 100 * (typed.length / minLength);
        const progressBar = document.getElementById('description_progression');
        if (progress < 100) {
            progressBar.style.width = `${progress}%`;
            progressBar.style.backgroundColor = 'gray';
        } else if (progress === 100) {
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = 'green';
        } else {
            progressBar.style.width = '100%';
        }
    }

    resetForm = () => {
        this.props.reset();
    }

    submitAdEdit = () => {
        const { ad, adEditForm } = this.props;
        const formValues = adEditForm.values;
        formValues.rentTime = parseInt(formValues.rentTime, 10) || null;
        formValues.budgetType = formValues.budgetType || null;
        formValues.budget = parseInt(formValues.budget, 10) || null;
        formValues.id = ad.id;
        if (formValues.description === ad.description &&
            formValues.rentTime === ad.rentTime &&
            formValues.budgetType === ad.budgetType &&
            formValues.budget === ad.budget) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Error',
                    message: 'No changes made to ad',
                    errors: {},
                },
            });
        } else {
            this.props.actionPutAd(formValues);
        }
    }

    handleNotificationDismiss = () => {
        const { title } = this.state.notification;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (title === 'Success') {
            this.props.router.push('/my-ads');
        }
    }

    render() {
        const main = process.env.ROOT_CATEGORIES.split(',');
        const budgetTypes = [
            { value: '', label: 'Select' },
            { value: 'hour', label: 'per hour' },
            { value: 'day', label: 'per day' },
            { value: 'global', label: 'global' },
            { value: 'quote', label: 'quote' },
            { value: 'free', label: 'free' },
        ];
        const {
            ad,
            classes,
            handleSubmit,
            submitting,
            invalid,
            error,
            pristine,
            buyOrRent,
            budgetType,
        } = this.props;
        const adType = ad.category.root.title;
        if (error) {
            return (
                <div>{error.messageKey}</div>
            );
        }
        return (
            <>
                <form
                    name="ad_edit_form"
                    onSubmit={handleSubmit(this.submitAdEdit)}
                >
                    {typeof window !== 'undefined' ?
                        (
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
                                    validate={[minLengthWithoutHTML25, maxLength300]}
                                    variant="outlined"
                                />
                                <div id="description_indication" className="form_input">
                                    <div>
                                        <div id="description_progression" className={classes.progress} />
                                    </div>
                                </div>
                            </div>
                        )
                        : null}
                    {adType === main[0] ? (
                        <div className="form_input" id="buyOrRent">
                            <Field
                                name="buyOrRent"
                                type="radio"
                                row
                                component={renderRadio}
                                options={[
                                    { title: 'Buy', id: 'buy', value: 'buy' },
                                    { title: 'Rent', id: 'rent', value: 'rent' },
                                ]}
                            />
                        </div>
                    ) : ''}
                    {adType === main[1] ?
                        (
                            <div className="form_input form_select">
                                <Field
                                    name="budgetType"
                                    type="select"
                                    id="budgetType"
                                    component={RenderSelect}
                                    variant="outlined"
                                    label="Budget type"
                                >
                                    {budgetTypes.map((option) => {
                                        return (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        );
                                    })}
                                </Field>
                            </div>
                        )
                        : null}
                    {buyOrRent === 'rent' ? (
                        <div className="form_input">
                            <Field
                                name="rent_time"
                                type="number"
                                id="rent_time"
                                label="Rent time"
                                component={renderInput}
                                variant="outlined"
                            />
                        </div>
                    )
                        : null}
                    {adType === main[0] || budgetType === 'hour' || budgetType === 'day' || budgetType === 'global' ? (
                        <div className="form_input">
                            <Field
                                name="budget"
                                type="number"
                                id="budget"
                                label="Budget"
                                component={renderInput}
                                validate={[isNumber, minValue0]}
                                variant="outlined"
                            />
                        </div>
                    )
                        : null}
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
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={
                        this.handleNotificationDismiss
                    }
                />
            </>
        );
    }
}

AdEditForm.propTypes = {
    change: PropTypes.func.isRequired,
    error: PropTypes.any,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    ad: PropTypes.object.isRequired,
    buyOrRent: PropTypes.string,
    budgetType: PropTypes.string,
    classes: PropTypes.object.isRequired,
    adEditForm: PropTypes.object,
    dataPutAd: PropTypes.any,
    actionPutAd: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
};


const selector = formValueSelector('AdEditForm');
const mapStateToProps = (state) => {
    const { buyOrRent, budgetType } = selector(state, 'buyOrRent', 'budgetType');
    return {
        buyOrRent,
        budgetType,
        isLoading: state.ad.isLoadingAd,
        dataAd: state.ad.dataAd,
        dataPutAd: state.ad.dataPutAd,
        adEditForm: state.form.AdEditForm,
    };
};
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionPutAd,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(reduxForm({
    form: 'AdEditForm',
})(withStyles(styles)(AdEditForm)));
