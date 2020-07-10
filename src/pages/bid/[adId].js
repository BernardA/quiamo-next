import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'next/router';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import BidForm from '../../components/bidInsertForm';
import { actionGetAd, actionGetUserProfile } from '../../store/actions';
import { Loading } from '../../components/loading';
import NotifierDialog from '../../components/notifierDialog';
import AdDetails from '../../components/adDetails';
import getCategories from '../../lib/getCategories';

class BidHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ad: null,
            userProfile: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const { adId } = this.props;
        this.getAd(adId);
        this.setProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        const { userProfile } = this.props;
        if (!prevState.ad && this.state.ad) {
            const { ad } = this.state;
            if (userProfile && ad) {
                if (ad.user.id === userProfile.id) {
                    this.setState({
                        notification: {
                            status: 'ok_and_dismiss',
                            title: 'Not allowed',
                            message: 'You cannot bid on your own ad',
                            errors: {},
                        },
                    });
                }
            }
        }
        if (!prevProps.dataGetAd && this.props.dataGetAd) {
            this.setState({
                ad: this.props.dataGetAd,
            });
        }
        if (!prevProps.errorReq && this.props.errorReq) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Error',
                    message: 'Please correct below',
                    errors: this.props.errorReq,
                },
            });
        }
        if (prevProps.userProfile !== userProfile) {
            this.setProfile();
        }
    }

    getAd = (adId) => {
        localforage.getItem('ads').then((value) => {
            if (value) {
                const ad = value.filter((ad1) => {
                    return ad1.node._id === parseInt(adId, 10);
                });
                if (ad.length === 1) {
                    this.setState({
                        ad: ad[0].node,
                    });
                } else {
                    this.props.actionGetAd(adId);
                }
            } else {
                this.props.actionGetAd(adId);
            }
        }).catch(() => {
            this.props.actionGetAd(adId);
        });
    };

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

    handleNotificationDismiss = () => {
        const { notification: { title } } = this.state;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (title === 'Not allowed') {
            this.props.router.push('/search');
        }
    }

    render() {
        const { ad } = this.state;
        const {
            isLoading,
            router,
        } = this.props;
        const { userProfile } = this.state;
        return (
            <>
                <main>
                    {!ad || isLoading ? <Loading /> : null}
                    {ad ? (
                        <>
                            <AdDetails ad={ad} isAction={false} />
                            <BidForm
                                ad={ad}
                                userProfile={userProfile}
                                location={router}
                            />
                        </>
                    ) : null}
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={
                            this.handleNotificationDismiss
                        }
                    />
                </main>
            </>
        );
    }
}

BidHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    adId: PropTypes.string.isRequired,
    actionGetAd: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dataGetAd: PropTypes.any,
    errorReq: PropTypes.any,
    userProfile: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dataGetAd: state.ad.dataGetAd,
        isLoading: state.ad.isLoadingAd,
        errorReq: state.ad.errorReq,
        userProfile: state.auth.userProfile,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetAd,
            actionGetUserProfile,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(BidHome)));

export async function getServerSideProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}