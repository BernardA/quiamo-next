import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import {
    actionGetUserProfile,
    actionDeleteBid,
} from '../../store/actions';
import BidList from '../../components/myBidsList';
import { Loading } from '../../components/loading';
import NotifierDialog from '../../components/notifierDialog';
import getCategories from '../../lib/getCategories';
import { handlePrivateRoute } from '../../tools/functions';

class MyBidsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            bidToDelete: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        this.setProfile();
    }

    componentDidUpdate(prevProps) {
        const {
            userProfile,
            dataPostBid,
            errorPostBid,
            cookies,
        } = this.props;
        if (prevProps.userProfile !== userProfile) {
            this.setProfile();
        }
        if (!prevProps.dataPostBid && dataPostBid) {
            this.props.actionGetUserProfile(cookies.get('userId'));
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success',
                    message: 'Bid deleted',
                    errors: {},
                },
            });
        }
        if (!prevProps.errorPostBid && errorPostBid) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Error',
                    message: 'Please correct error below',
                    errors: errorPostBid,
                },
            });
        }
    }

    setProfile = () => {
        const { userProfile, cookies } = this.props;
        if (cookies.get('userId')) {
            if (userProfile) {
                this.setState({ userProfile });
            } else {
                localforage.getItem('userProfile').then((value) => {
                    if (value) {
                        this.setState({ userProfile: value });
                    } else {
                        this.props.actionGetUserProfile(cookies.get('userId'));
                    }
                });
            }
        }
    }

    handleDeleteConfirmation = (event) => {
        this.setState({
            bidToDelete: event.target.id,
            notification: {
                status: 'confirm',
                title: 'Confirmation required',
                message: 'Please confirm bid delete',
                errors: {},
            },
        });
    }

    handleNotificationDismiss = (event) => {
        const { title } = this.state.notification;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (title.includes('Confirmation') && event.target.id === 'confirmed') {
            this.props.actionDeleteBid(`/api/bids/${this.state.bidToDelete}`);
        }
    }

    render() {
        const { userProfile } = this.state;
        const {
            isLoadingProfile,
            isLoading,
        } = this.props;
        return (
            <main>
                {(isLoadingProfile &&
                    !userProfile) || !userProfile || isLoading ? <Loading /> : null}
                {
                    userProfile ? (
                        <BidList
                            bids={userProfile.bids}
                            handleDeleteBid={this.handleDeleteConfirmation}
                        />
                    ) : null
                }
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </main>
        );
    }
}

MyBidsHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    actionDeleteBid: PropTypes.func.isRequired,
    userProfile: PropTypes.any,
    isLoadingProfile: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dataPostBid: PropTypes.any,
    errorPostBid: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.bid,
        userProfile: state.auth.userProfile,
        isLoadingProfile: state.auth.isLoading,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetUserProfile,
            actionDeleteBid,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyBidsHome));

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
