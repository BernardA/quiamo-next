import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geocode from 'react-geocode';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
} from '@material-ui/core';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { actionPutAddress, actionGetUserProfile } from '../../store/actions';
import NotifierDialog from '../../components/notifierDialog';
import { Loading } from '../../components/loading';
import styles from '../../styles/login.module.scss';
import Breadcrumb from '../../components/breadcrumb';
import AddressChangeForm from '../../components/userAddressChangeForm';
import getCategories from '../../lib/getCategories';
import { handlePrivateRoute } from '../../tools/functions';

class AccountAddressChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResetForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const { userProfile } = this.props;
        if (!userProfile) {
            this.props.actionGetUserProfile(this.props.cookies.get('userId'));
        }
    }

    componentDidUpdate(prevProps) {
        const { errorAddress, dataAddress } = this.props;
        if (prevProps.errorAddress !== errorAddress && errorAddress) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct errors below.',
                    errors: errorAddress,
                },
            });
        }
        if (prevProps.dataAddress !== dataAddress && dataAddress) {
            this.props.actionGetUserProfile(this.props.cookies.get('userId'));
            this.setState({
                isResetForm: true,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your changes were processed.',
                    errors: {},
                },
            });
        }
    }

    handleSubmitAddressChange = () => {
        const values = this.props.addressChangeForm.values;
        values.id = this.props.userProfile.address.id;
        // get coordinates
        const address = `${values.address1} ${values.address2} ${values.city} ${values.postalCode} France`;
        Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
        Geocode.fromAddress(address)
            .then((response) => {
                const { lat, lng } = response.results[0].geometry.location;
                values.lat = lat;
                values.lng = lng;
                this.props.actionPutAddress(values);
            })
            .catch(() => {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'Address error',
                        message:
                            'Your address does not seem valid. Please verify',
                        errors: {},
                    },
                });
            });
    };

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });

        if (this.props.dataAddress) {
            this.props.router.push('/account');
        }
    };

    render() {
        const { isLoading } = this.props;
        const { isResetForm } = this.state;
        return (
            <main>
                {isLoading ? <Loading /> : null}
                <Breadcrumb links={[
                    { href: '/account', text: 'account' },
                    { href: null, text: 'change-address' },
                ]}
                />
                <Card id="noShadow" className={styles.root}>
                    <CardHeader
                        className={styles.header}
                        title={(
                            <Typography className={styles.title} component="h3">
                                Adress change
                            </Typography>
                        )}
                    />
                    <CardContent className={styles.content}>
                        <AddressChangeForm
                            isResetForm={isResetForm}
                            handleSubmitAddressChange={this.handleSubmitAddressChange}
                        />
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

AccountAddressChange.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    addressChangeForm: PropTypes.any,
    actionPutAddress: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    errorAddress: PropTypes.any,
    dataAddress: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    userProfile: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.account,
        userProfile: state.auth.userProfile,
        addressChangeForm: state.form.UserAddressChangeForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionPutAddress,
        actionGetUserProfile,
    }, dispatch);
}
// https://redux-form.com/7.2.2/docs/faq/howtoconnect.md/
// eslint-disable-next-line no-class-assign
export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AccountAddressChange));

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    let categories = await getCategories();
    categories = categories.data.categories;
    handlePrivateRoute(context);
    return {
        props: {
            categories,
        },
    };
}