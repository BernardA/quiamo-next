import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import {
    actionGetUserProfile,
} from '../../store/actions';
import { Loading } from '../../components/loading';
import AdList from '../../components/myAdsList';
import getCategories from '../../lib/getCategories';
import { handleIsNotAuthenticated, handleCheckAuthentication } from '../../tools/functions';

class MyAdsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
        };
    }

    componentDidMount() {
        const { isAuth: { isAuthenticated } } = this.props;
        if (!isAuthenticated) {
            handleIsNotAuthenticated();
        } else { 
            this.setProfile();
        }
    }

    componentDidUpdate(prevProps) {
        const { userProfile } = this.props;
        if (prevProps.userProfile !== userProfile) {
            this.setProfile();
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

    render() {
        const { userProfile } = this.state;
        const { isLoadingProfile, isLoadingUserAds, isAuth: { isAuthenticated } } = this.props;
        if (!isAuthenticated) {
            return null;
        }
        return (
            <main>
                {isLoadingUserAds ||
                    (isLoadingProfile && !userProfile) || !userProfile ? <Loading /> 
                    : null}
                {
                    userProfile ? <AdList userProfile={userProfile} /> : null
                }
            </main>
        );
    }
}

MyAdsHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    userProfile: PropTypes.any,
    isLoadingProfile: PropTypes.bool.isRequired,
    isLoadingUserAds: PropTypes.bool.isRequired,
    isAuth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
        userProfile: state.auth.userProfile,
        isLoadingProfile: state.auth.isLoading,
        isAuth: PropTypes.object.isRequired,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetUserProfile,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(MyAdsHome)));

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