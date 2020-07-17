import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Loading } from '../../../components/loading';
import AdDetails from '../../../components/adDetails';
import BidList from '../../../components/myAdsBidList';
import Breadcrumb from '../../../components/breadcrumb';
import getCategories from '../../../lib/getCategories';
import { handleCheckAuthentication, handleIsNotAuthenticated } from '../../../tools/functions';
import { apiQl } from '../../../store/sagas';

const  MyAdsBids = (props) => {
    const router = useRouter();
    const { 
        ad, 
        isAuth: { isAuthenticated }, 
    } = props;
    useEffect(() => {
        if (!isAuthenticated) {
            handleIsNotAuthenticated(router);
        }
    }, []);
    const isMyAds = router.pathname.includes('my-ads');
    const parentLocation = isMyAds ? 'my-ads' : 'my-bids';
    if (!isAuthenticated) {
        return null;
    }
    return (
        <main>
            <Breadcrumb links={[{ href: `/${parentLocation}`, text: parentLocation }]} />
            {ad ? (
                <>
                    <AdDetails ad={ad} isAction={false} />
                    <BidList bids={ad.bids} isMyAds={isMyAds} />
                </>
            ) : <Loading />}
        </main>
    );
}

MyAdsBids.propTypes = {
    isAuth: PropTypes.object.isRequired,
    ad: PropTypes.any,
};


export default MyAdsBids;

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
    // https://github.com/vercel/next.js/discussions/11281
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
            ad,
        },
    };
}