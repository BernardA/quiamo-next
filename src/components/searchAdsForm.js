/* eslint-disable camelcase */
import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import { required } from '../tools/validator';
import { renderInput, renderRadio } from './formInputs';
import AutocompleteGrouped from './formInputAutocompleteGrouped';
import { urlWriter } from '../tools/functions';
import { ROOT_CATEGORIES } from '../parameters';

const styles = () => ({
    formWrapper: {
        backgroundColor: '#bab2b5',
        padding: '15px',
        marginBottom: '30px',
    },
    formInputs: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        borderBottom: '1px solid #ccc',
        '& > div:first-child': {
            '& > div:first-child': {
                height: '100%',
            },
        },
    },
    formInput: {
        flex: '0 0 280px',
        marginBottom: '20px',
    },
    buttons: {
        margin: '0 auto',
        width: '300px',
        '& button': {
            marginBottom: '10px',
        },
    },
    placeSelect: {
        minWidth: '250px',
    },
});

class SearchAdsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchPlacesResult: [],
            isPlaceSelectDialogOpen: false,
            isNullPlaceSearchResult: false,
            anchorEl: null,
        };
    }

    componentDidUpdate(prevProps) {
        const { adType } = this.props;
        if (prevProps.adType !== adType) {
            this.handleTypeRadioChange();
        }
    }

    handleSubmitSearchAds = () => {
        const {
            categories,
            searchAdsForm: { values },
            router,
        } = this.props;
        const subcat = categories.filter((cat) => {
            return (
                cat.parent &&
                cat.root &&
                cat.root.title === values.adType &&
                cat.title === values.subcategory
            );
        });
        const type = urlWriter(values.adType);
        const cat = urlWriter(subcat[0].parent.title);
        const subcategory = urlWriter(values.subcategory);
        const place = urlWriter(values.place);
        router.push(`/search/${place}/${type}/${cat}/${subcategory}`);
    };

    handleTypeAheadPlaces = (event) => {
        this.setState({
            isPlaceSelectDialogOpen: false,
            anchorEl: document.getElementById('place'),
        });
        const { addresses } = this.props;
        // search addresses for form input, typeahead style
        // document.getElementById('no_cat_search').innerHTML = '';
        const places = urlWriter(event.target.value);
        const searchResult = [];
        if (places.length > 2) {
            // start search only after 2 characters input
            /*
            const isAlreadyIn = (place) => {
                let result = false;
                for (let i = 0; i < searchResult.length; i++) {
                    if (searchResult[i].node && searchResult[i].node.city === place.node.city) {
                        result = true;
                    }
                }
                return result;
            };
            */
            addresses.forEach((place) => {
                if (isNaN(places)) {
                    if (urlWriter(place.city).includes(places)) {
                        searchResult.push(place);
                    }
                }
            });
            if (searchResult.length === 0) {
                this.setState({ isNullPlaceSearchResult: false });
            }
            this.setState({
                searchPlacesResult: searchResult,
                isPlaceSelectDialogOpen: true,
                anchorEl: document.getElementById('place'),
            });
        }
    };

    handleTypeRadioChange = () => {
        if (document.getElementsByName('subcategory')[0].value !== '') {
            const subcategoryClear = document.getElementsByClassName(
                'MuiAutocomplete-clearIndicator',
            );
            if (subcategoryClear.length > 0) {
                subcategoryClear[0].click();
            }
        }
    };

    handleOptionsClick = (event) => {
        this.setState({
            searchPlacesResult: [],
            isPlaceSelectDialogOpen: false,
        });
        this.props.change('place', event.target.id);
    };

    resetOrReturn = () => {
        if (this.props.router.pathname !== '/search/0/0/0/0') {
            this.props.router.push('/search/0/0/0/0');
        }
        // document.getElementById('no_cat_search').innerHTML = '';
        // this.setState({ isNullPlaceSearchResult: true });
        const subcategoryClear = document.getElementsByClassName(
            'MuiAutocomplete-clearIndicator',
        );
        if (subcategoryClear.length > 0) {
            subcategoryClear[0].click();
        }
        document.querySelector('#place').value = '';
    };

    render() {
        const main = ROOT_CATEGORIES.split(',');
        const {
            categories,
            adType,
            classes,
            handleSubmit,
            invalid,
            submitting,
            error,
            router,
            pristine,
        } = this.props;
        const {
            searchPlacesResult,
            isPlaceSelectDialogOpen,
            anchorEl,
            isNullPlaceSearchResult,
        } = this.state;
        if (error) {
            return <div>{error.messageKey}</div>;
        }
        const isDisabled = () => {
            if (router.pathname === '/search/0/0/0/0') {
                if (submitting || pristine) {
                    return true;
                }
            }
            return false;
        };

        return (
            <div className={classes.formWrapper}>
                <form onSubmit={handleSubmit(this.handleSubmitSearchAds)}>
                    <div className={classes.formInputs}>
                        <div className={classes.formInput}>
                            <Field
                                name="adType"
                                type="radio"
                                component={renderRadio}
                                validate={[required]}
                                row
                                options={[
                                    {
                                        title: main[0],
                                        id: main[0],
                                        value: main[0],
                                    },
                                    {
                                        title: main[1],
                                        id: main[1],
                                        value: main[1],
                                    },
                                ]}
                            />
                        </div>
                        <div className={classes.formInput}>
                            <Field
                                name="subcategory"
                                id="subcategory"
                                type="text"
                                validate={[required]}
                                label="Category"
                                selectedTypeRadio={adType}
                                categories={categories}
                                component={AutocompleteGrouped}
                                disabled={adType === undefined}
                            />
                        </div>
                        <div className={classes.formInput}>
                            <Field
                                name="place"
                                id="place"
                                type="text"
                                label="Place"
                                validate={[required]}
                                component={renderInput}
                                onKeyUp={this.handleTypeAheadPlaces}
                                helperText="Enter Curitiba, Fortaleza, Blumenau, Florianopolis, Sao Paulo"
                                autocomplete="off"
                            />
                            {isNullPlaceSearchResult ? (
                                <span className="form_error">
                                    No ads match your search
                                </span>
                            ) : null}
                            <Popper
                                id="placeSelect"
                                open={isPlaceSelectDialogOpen}
                                anchorEl={anchorEl}
                                transition
                            >
                                {({ TransitionProps }) => (
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    <Fade {...TransitionProps} timeout={350}>
                                        <Paper>
                                            <List>
                                                {searchPlacesResult.map(
                                                    (row) => {
                                                        return (
                                                            <ListItem
                                                                key={row.city}
                                                                id={`${row.city}`}
                                                                className={
                                                                    classes.placeSelect
                                                                }
                                                                // data-postal={row.node.postalCode}
                                                                data-city={
                                                                    row.city
                                                                }
                                                                onClick={
                                                                    this
                                                                        .handleOptionsClick
                                                                }
                                                            >
                                                                <ListItemText
                                                                    className="no_click"
                                                                    primary={`${row.city}`}
                                                                />
                                                            </ListItem>
                                                        );
                                                    },
                                                )}
                                            </List>
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        </div>
                    </div>
                    <FormGroup className={classes.buttons}>
                        <Button
                            variant="outlined"
                            color="primary"
                            name="_submit"
                            type="submit"
                            disabled={submitting || invalid}
                        >
                            Search
                        </Button>
                        <Button
                            id="reset_return"
                            onClick={this.resetOrReturn}
                            variant="outlined"
                            color="primary"
                            disabled={isDisabled()}
                        >
                            Return/Clear
                        </Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

SearchAdsForm.propTypes = {
    error: PropTypes.object,
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    categories: PropTypes.any,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    addresses: PropTypes.array.isRequired,
    subcategory: PropTypes.any,
    adType: PropTypes.string,
    searchAdsForm: PropTypes.any,
};

const selector = formValueSelector('SearchAdsForm');
export default connect((state) => {
    const { subcategory, adType } = selector(state, 'subcategory', 'adType');
    return {
        ...state.ad,
        subcategory,
        adType,
        searchAdsForm: state.form.SearchAdsForm,
    };
})(
    reduxForm({
        form: 'SearchAdsForm',
    })(withStyles(styles)(SearchAdsForm)),
);
