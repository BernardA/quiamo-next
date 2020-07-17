import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import BidForm from '../../components/bidInsertForm';
import { actionGetUserProfile } from '../../store/actions';
import NotifierInline from '../../components/notifierInline';
import AdDetails from '../../components/adDetails';
import getCategories from '../../lib/getCategories';
import { handleCheckAuthentication, handleIsNotAuthenticated } from '../../tools/functions';
import { Loading } from '../../components/loading';
import { apiQl } from '../../store/sagas';

class BidHome extends React.Component {
    componentDidMount() {
        console.log('BID PROPS', this.props);
        const { isAuth: { isAuthenticated } } = this.props;
        if (!isAuthenticated) {
            handleIsNotAuthenticated();
        } else { 
            this.setProfile();
        }
    }

    setProfile = () => {
        const { userProfile, cookies } = this.props;
        if (cookies.get('userId')) {
            if (!userProfile) {
                this.props.actionGetUserProfile(cookies.get('userId'));
            }
        } else {
            this.handleNotAuthenticated();
        }
    }

    render() {
        const {
            ad,
            router,
            userProfile,
            isAuth: { isAuthenticated},
        } = this.props;
        if (!isAuthenticated) {
            return null;
        }
        if (!ad) {return null;}
        if (Object.keys(ad).length === 0) {
            return <NotifierInline isNotClosable message="Sorry, this ad is no longer available." />
        }

        return (
            <main>
                <AdDetails ad={ad} isAction={false} />
                { userProfile ? 
                    (
                        <BidForm
                            ad={ad}
                            userProfile={userProfile}
                            router={router}
                        />
                    )
                    : <Loading />}
            </main>
        );
    }
}

BidHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    ad: PropTypes.any,
    actionGetUserProfile: PropTypes.func.isRequired,
    userProfile: PropTypes.any,
    router: PropTypes.object.isRequired,
    isAuth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.auth.userProfile,
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
)(withRouter(BidHome)));

const queryQl = `query getAd($id: ID!, $isDeleted: Boolean){
    ad(id: $id) {
        id
        _id
        createdAt
        description
        budget
        budgetType
        rentTime
        isActive
        bids(
            isDeleted: $isDeleted
            _order: {message_sentAt: "DESC"}
        ){
            id
            isDeleted
            bidder{
                _id
                id
                username
            }
            bidType
            bid
            message{
                id
                _id
                subject
                message
                sentAt
            }
        }
        user {
            id
            username
            image{
                filename
            }
            address{
                city
            }
        }
        category {
            id
            title
            parent{
                title
            }
            root{
                title
            }
        }
    }
}`;

export async function getServerSideProps(context) {
    const categories = await getCategories();
    let ad = null;
    const isAuth = handleCheckAuthentication(context);
    if (isAuth.isAuthenticated){
        const { params: { adId } } = context;
        const variables = {
            id: `/api/ads/${adId}`,
            isDeleted: false,
        };
        const data = await apiQl(queryQl, variables, false);
        ad = data.data.ad;
    }
    return {
        props: {
            categories: categories.data.categories,
            isAuth,
            ad
        },
    };
}