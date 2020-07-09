import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import {
    actionGetUserProfile,
} from '../../store/actions';
import { Loading } from '../../components/loading';
import AdList from '../../components/myAdsList';

class MyAdsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
        };
    }

    componentDidMount() {
        this.setProfile();
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
        const { isLoadingProfile, isLoadingUserAds } = this.props;
        return (
            <main>
                {isLoadingUserAds ||
                    (isLoadingProfile && !userProfile) || !userProfile ? <Loading /> : null}
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
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
        userProfile: state.auth.userProfile,
        isLoadingProfile: state.auth.isLoading,
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
)(MyAdsHome));