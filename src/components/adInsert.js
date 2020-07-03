import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Router from 'next/router';
import localforage from 'localforage';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import AdInsertForm from './adInsertForm';
import NotifierDialog from './notifierDialog';
import { Loading } from './loading';
import {
    actionPostAd,
} from '../store/actions';

class Ad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClearForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const {
            adInsertForm,
            cookies,
            dataAd,
            errorReq,
        } = this.props;
        const isAuthenticated = !!cookies.get('username');

        if (!prevProps.dataAd && dataAd) {
            // if it is not coming from offline storage
            // ???only show notification if user is currently on the ad page
            // update indexeddb data
            // dispatch event to refresh ads
            if (isAuthenticated) { // is authenticated
                const refreshAds = new CustomEvent('refresh_ads');
                window.dispatchEvent(refreshAds);
                this.setState({
                    isClearForm: true,
                    notification: {
                        status: 'post_insert_ad_logged_in',
                        title: 'Your ad is published!',
                        message: 'View your ad or continue your navigation',
                        errors: {},
                    },
                });
            } else {
                localforage.setItem('pendingAdId', dataAd.ad._id);
                this.setState({
                    isClearForm: true,
                    notification: {
                        status: 'post_insert_ad_register',
                        title: 'Your ad is registered!',
                        message: 'Login or registration is required for publication.',
                        errors: {},
                    },
                });
            }
        }
        if (!prevProps.errorReq && errorReq) {
            this.setState({
                isClearForm: false,
                notification: {
                    status: 'error',
                    title: 'Something went wrong...',
                    message: 'Please review the following:',
                    errors: errorReq,
                },
            });
        }
        if (prevProps.adInsertForm && adInsertForm &&
            (prevProps.adInsertForm.values && adInsertForm.values) &&
            (prevProps.adInsertForm.values.description !==
            adInsertForm.values.description) &&
            adInsertForm.values.description) {
            this.handleDescriptionChange();
        }
    }

    handleSubmitAdInsert = () => {
        const formValues = this.props.adInsertForm.values;
        const { categories, cookies } = this.props;
        const cat = categories.filter((item) => {
            return item.title === formValues.category;
        });
        formValues.category = cat[0].id;
        formValues.user = cookies.get('userId');
        this.props.actionPostAd(formValues);
    }

    handleDescriptionChange = () => {
        const typed = this.props.adInsertForm.values.description.replace(
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

    handleNotificationDismiss = (event) => {
        this.setState({
            isClearForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        const clas = Array.from(event.target.classList);
        if (clas.includes('toggleRegister') || clas.includes('toggleLogin')) {
            if (clas.includes('toggleRegister')) {
                Router.push('/register');
            } else {
                Router.push('/login');
            }
        }
        if (clas.includes('goToAd')) {
            Router.push(`/adview/${this.props.dataAd.ad._id}`);
        }
    }

    render() {
        const { isLoading, categories } = this.props;
        const {
            isClearForm,
            notification,
        } = this.state;
        return (
            <>
                {isLoading ? <Loading /> : null}
                <AdInsertForm
                    submitAdInsert={this.handleSubmitAdInsert}
                    handleDescriptionChange={this.handleDescriptionChange}
                    isClearForm={isClearForm}
                    categories={categories}
                />
                <NotifierDialog
                    notification={notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </>
        );
    }
}


Ad.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    adInsertForm: PropTypes.object,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionPostAd: PropTypes.func.isRequired,
    dataAd: PropTypes.any,
    errorReq: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        isLoading: state.ad.isLoadingAd,
        dataAd: state.ad.dataAd,
        errorReq: state.ad.errorReq,
        adInsertForm: state.form.AdInsertForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionPostAd,
        // actionShowMap,
    }, dispatch);
}

export default withCookies(
    connect(mapStateToProps, mapDispatchToProps)(Ad),
);