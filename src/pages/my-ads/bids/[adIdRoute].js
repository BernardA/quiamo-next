import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
    actionGetAd,
} from '../../../store/actions';
import { Loading } from '../../../components/loading';
import AdDetails from '../../../components/adDetails';
import BidList from '../../../components/myAdsBidList';
import NotifierDialog from '../../../components/notifierDialog';
import Breadcrumb from '../../../components/breadcrumb';
import getCategories from '../../../lib/getCategories';
import { handlePrivateRoute } from '../../../tools/functions';

class MyAdsBids extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ad: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const { adIdRoute } = this.props;
        this.props.actionGetAd(adIdRoute);
    }

    componentDidUpdate(prevProps) {
        const { dataGetAd } = this.props;
        if (!prevProps.dataGetAd && dataGetAd) {
            this.setState({ ad: dataGetAd });
        }
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    render() {
        const { isLoadingAd, isLoading, router } = this.props;
        const { ad } = this.state;
        const isMyAds = router.pathname.includes('my-ads');
        const parentLocation = isMyAds ? 'my-ads' : 'my-bids';
        return (
            <main>
                {isLoading || isLoadingAd || !ad ? <Loading /> : null}
                <Breadcrumb links={[{ href: `/${parentLocation}`, text: parentLocation }]} />
                {ad ? (
                    <>
                        <AdDetails ad={ad} isAction={false} />
                        <BidList bids={ad.bids} isMyAds={isMyAds} />
                    </>
                ) : null}
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </main>
        );
    }
}

MyAdsBids.propTypes = {
    actionGetAd: PropTypes.func.isRequired,
    isLoadingAd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    adIdRoute: PropTypes.string.isRequired,
    dataGetAd: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetAd,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyAdsBids);

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