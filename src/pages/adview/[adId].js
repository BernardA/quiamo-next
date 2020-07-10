import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import { Loading } from '../../components/loading';
import AdDetails from '../../components/adDetails';
import Pub300x600 from '../../components/pub300x600';
import styles from '../../styles/search.module.scss';
import { actionGetAd } from '../../store/actions';
import getCategories from '../../lib/getCategories';

class Adview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ad: null,
        };
    }

    componentDidMount() {
        const { adId } = this.props;
        this.getAd(adId);
    }

    componentDidUpdate(prevProps) {
        const { dataGetAd } = this.props;
        if (prevProps.dataGetAd !== dataGetAd && dataGetAd) {
            this.setState({ ad: dataGetAd });
        }
    }

    getAd = (adId) => {
        localforage.getItem('ads').then((value) => {
            if (value) {
                const ad = value.filter((ad1) => {
                    return ad1.node._id === parseInt(adId, 10);
                });
                if (ad.length === 1) {
                    this.setState({ ad: ad[0].node });
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

    render() {
        const { isLoadingAd, userProfile, router } = this.props;
        return (
            <main>
                {isLoadingAd ? <Loading /> : null}
                <div className="main-title">
                    <h1>
                        Ad view
                    </h1>
                </div>
                <div className={styles.content}>
                    <div>
                        {this.state.ad ? (
                            <AdDetails
                                ad={this.state.ad}
                                router={router}
                                userProfile={userProfile}
                                isAction
                            />
                        ) : null}
                    </div>
                    <Hidden xsDown>
                        <Pub300x600 />
                    </Hidden>
                </div>
            </main>
        );
    }
}

Adview.propTypes = {
    adId: PropTypes.string.isRequired,
    isLoadingAd: PropTypes.bool.isRequired,
    actionGetAd: PropTypes.func.isRequired,
    dataGetAd: PropTypes.any,
    userProfile: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
        userProfile: state.auth.userProfile,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionGetAd,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Adview);

export async function getServerSideProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}