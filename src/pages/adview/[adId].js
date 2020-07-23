import { connect } from 'react-redux';
import { Hidden } from '@material-ui/core/';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import AdDetails from '../../components/adDetails';
import Pub300x600 from '../../components/pub300x600';
import styles from '../../styles/search.module.scss';
import getCategories from '../../lib/getCategories';
import NotifierInline from '../../components/notifierInline';
import { apiQl } from '../../store/sagas';

const Adview = (props) => {
    const { userProfile, ad } = props;
    if (!ad) {
        return (
            <div style={{minHeight: '500px',display: 'grid', placeItems: 'center'}}>
                <NotifierInline isNotClosable message="This ad does not exist" />
            </div>
        )        
    }
    // TODO check is that's possible once ad query fixed as per TODOs
    if (Object.keys(ad).length === 0) {
        return (
            <div style={{minHeight: '500px',display: 'grid', placeItems: 'center'}}>
                <NotifierInline isNotClosable message="Sorry, this ad is no longer available." />
            </div>
        )
    }
    return (
        <main>
            <div className="main-title">
                <h1>
                    Ad view
                </h1>
            </div>
            <div className={styles.content}>
                <div>
                    {ad ? (
                        <AdDetails
                            ad={ad}
                            userProfile={userProfile}
                            isAction
                        />
                    ) : <Loading />}
                </div>
                <Hidden xsDown>
                    <Pub300x600 />
                </Hidden>
            </div>
        </main>
    );
}

Adview.propTypes = {
    ad: PropTypes.any,
    userProfile: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.auth.userProfile,
    };
};


export default connect(
    mapStateToProps,
    null,
)(Adview);

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
    const { params: { adId }} = context;
    const variables = {
        id: `/api/ads/${adId}`,
        isDeleted: false,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            categories: categories.data.categories,
            ad: data.data.ad,
        },
    };
}