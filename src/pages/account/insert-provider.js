/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'next/router';
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    FormGroup,
    TextField,
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import NotifierDialog from '../../components/notifierDialog';
import Breadcrumb from '../../components/breadcrumb';
import { actionPostUserAsProvider, actionGetUserProfile } from '../../store/actions';
import { renderInput } from '../../components/formInputs';
import { Loading } from '../../components/loading';
import styles from '../../styles/login.module.scss';
import { minLength, maxLength } from '../../tools/validator';
import { multisort, handleIsNotAuthenticated, handleCheckAuthentication } from '../../tools/functions';
import getCategories from '../../lib/getCategories';
import { ROOT_CATEGORIES } from '../../parameters';

const minLength3 = minLength(3);
const maxLength150 = maxLength(150);

class ProviderInsertForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const { router, isAuth: { isAuthenticated } } = this.props;
        if (!isAuthenticated) {
            handleIsNotAuthenticated(router);
        }
    }

    componentDidUpdate(prevProps) {
        const { errorPostUserAsProvider, dataPostUserAsProvider } = this.props;
        if (prevProps.errorPostUserAsProvider !== errorPostUserAsProvider &&
            errorPostUserAsProvider) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct below',
                    errors: errorPostUserAsProvider,
                },
            });
        }
        if (prevProps.dataPostUserAsProvider !== dataPostUserAsProvider &&
            dataPostUserAsProvider) {
            this.props.actionGetUserProfile(this.props.cookies.get('userId'));
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your profile is updated.',
                    errors: {},
                },
            });
        }
    }

    handleSubmit = () => {
        const { providerInsertForm: { values } } = this.props;
        this.props.actionPostUserAsProvider(values);
    }

    setValue = (value) => {
        this.setState({ value: [...value] });
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    };

    render() {
        const {
            categories,
            isLoading,
            handleSubmit,
            submitting,
            invalid,
            error,
            pristine,
            reset,
            isAuth: { isAuthenticated },
        } = this.props;
        const { value } = this.state;
        const options = [];
        const main = ROOT_CATEGORIES.split(',');
        main.forEach((type) => {
            categories.forEach((cat) => {
                if (cat.root && cat.root.title === type &&
                    cat.parent.title === type) {
                    const parentTitle = cat.title;
                    let local = [];
                    categories.forEach((cat1) => {
                        if (cat1.root && cat1.root.title === type &&
                            cat1.parent.title === parentTitle) {
                            // eslint-disable-next-line no-param-reassign
                            cat1.parentTitle = parentTitle;
                            // eslint-disable-next-line no-param-reassign
                            cat1.rootTitle = type;
                            local.push({ ...cat1 });
                        }
                    });
                    local = local.sort((a, b) => `${a.title}`.localeCompare(`${b.title}`));
                    options.push(...local);
                }
            });
        });
        const optionsSorted = () => multisort(options, ['rootTitle', 'parentTitle', 'title'], ['ASC']);
        const filterOptions = createFilterOptions({
            matchFrom: 'start',
            ignoreAccents: true,
            stringify: (option) => option.title,
        });

        const selectCategory = (field) => {
            return (
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    filterSelectedOptions
                    filterOptions={filterOptions}
                    groupBy={(option) => `${option.root.title} - ${option.parent.title}`}
                    options={optionsSorted()}
                    getOptionLabel={(option) => option.title}
                    getOptionSelected={(option, val) => option.title === val.title}
                    value={value}
                    onChange={(event, val) => {
                        // eslint-disable-next-line no-param-reassign
                        field.input.onChange(field.input.value = val.map((item) => item.id));
                        this.setValue(val);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            type={field.type}
                            id={field.id}
                            label={field.label}
                            helperText={field.helperText}
                            className={field.className}
                            placeholder={field.placeholder}
                            disabled={field.disabled}
                            variant={field.variant}
                        />
                    )}
                />
            );
        };
        if (!isAuthenticated) {
            return null;
        }
        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <main>
                {isLoading ? <Loading /> : null}
                <Breadcrumb links={[
                    { href: '/account', text: 'account' },
                    { href: null, text: 'provider-insert' },
                ]}
                />
                <Card id="noShadow" className={styles.root}>
                    <CardHeader
                        className={styles.header}
                        title={(
                            <Typography className={styles.title} component="h3">
                                Provider
                            </Typography>
                        )}
                    />
                    <CardContent className={styles.content}>
                        <form onSubmit={handleSubmit(this.handleSubmit)}>
                            <div className="form_input">
                                <Field
                                    name="businessName"
                                    type="text"
                                    label="Business name"
                                    autofocus
                                    component={renderInput}
                                    validate={[minLength3, maxLength150]}
                                    variant="outlined"
                                />
                            </div>
                            <div className="form_input">
                                <Field
                                    type="text"
                                    name="providedCategories"
                                    id="providedCategories"
                                    variant="outlined"
                                    label="Select categories"
                                    component={selectCategory}
                                />
                            </div>
                            <div className="form_input form_submit">
                                <FormGroup row>
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
                                        onClick={() => reset()}
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
                    </CardContent>
                </Card>
            </main>
        );
    }
}

ProviderInsertForm.propTypes = {
    categories: PropTypes.array.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    actionPostUserAsProvider: PropTypes.func.isRequired,
    dataPostUserAsProvider: PropTypes.any,
    errorPostUserAsProvider: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    providerInsertForm: PropTypes.any,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    isAuth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isLoading: state.account.isLoading,
        dataPostUserAsProvider: state.account.dataPostUserAsProvider,
        errorPostUserAsProvider: state.account.errorPostUserAsProvider,
        providerInsertForm: state.form.ProviderInsertForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostUserAsProvider,
            actionGetUserProfile,
        },
        dispatch,
    );
}

// eslint-disable-next-line no-class-assign
ProviderInsertForm = withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ProviderInsertForm)));

export default reduxForm({
    form: 'ProviderInsertForm',
})(ProviderInsertForm);

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    const categories = await getCategories();
    return {
        props: {
            categories: categories.data.categories,
            isAuth: handleCheckAuthentication(context),
        },
    };
}