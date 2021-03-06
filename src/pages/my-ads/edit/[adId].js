import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import {
    Button,
    FormGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import PropTypes from 'prop-types';
import {
    actionGetUserProfile,
    actionDeleteAd,
    actionToggleActiveAd,
} from '../../../store/actions';
import { Loading } from '../../../components/loading';
import AdDetails from '../../../components/adDetails';
import AdEditForm from '../../../components/myAdsAdEditForm';
import NotifierDialog from '../../../components/notifierDialog';
import Breadcrumb from '../../../components/breadcrumb';
import styles from '../../../styles/admin.module.scss';
import getCategories from '../../../lib/getCategories';
import { handleCheckAuthentication, handleIsNotAuthenticated } from '../../../tools/functions';
import { apiQl } from '../../../store/sagas';

class AdEdit extends React.Component {
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
        const { ad, isAuth: { isAuthenticated } } = this.props;
        if (!isAuthenticated) {
            handleIsNotAuthenticated();
        } else {
            this.setState({
                ad,
            });
        }
    }

    componentDidUpdate(prevProps) {
        const {
            dataGetAd,
            dataPutAd,
            dataDeleteAd,
            dataToggleActiveAd,
            cookies,
            errorReq,
            router,
        } = this.props;
        if (!prevProps.dataGetAd && dataGetAd) {
            this.setState({
                ad: dataGetAd,
            });
        }
        if (!prevProps.dataPutAd && dataPutAd) {
            if (router.pathname.includes('my-ads')) {
                this.props.actionGetUserProfile(cookies.get('userId'));
            }
            // update localforage ads
            localforage.getItem('ads').then((value) => {
                if (value) {
                    const ads = value.map((ad) => {
                        if (ad.node.id === dataPutAd.ad.id) {
                            // eslint-disable-next-line no-param-reassign
                            ad.node = dataPutAd.ad;
                        }
                        return ad;
                    });
                    localforage.setItem('ads', ads);
                }
            });
        }
        if (!prevProps.dataDeleteAd && dataDeleteAd) {
            if (router.pathname.includes('my-ads')) {
                this.props.actionGetUserProfile(cookies.get('userId'));
            }
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success',
                    message: 'Ad deleted',
                    errors: {},
                },
            });
            // update localforage
            localforage.getItem('ads').then((value) => {
                if (value) {
                    const ads = value.filter((ad) => {
                        return ad.node.id !== dataDeleteAd.clientMutationId;
                    });
                    localforage.setItem('ads', ads);
                }
            });
        }
        if (!prevProps.dataToggleActiveAd && dataToggleActiveAd) {
            if (router.pathname.includes('my-ads')) {
                this.props.actionGetUserProfile(cookies.get('userId'));
            }
            // update localforage
            localforage.getItem('ads').then((value) => {
                let ads = [];
                if (value) {
                    ads = value.map((ad) => {
                        if (ad.node.id === dataToggleActiveAd.ad.id) {
                            // eslint-disable-next-line no-param-reassign
                            ad.node = dataToggleActiveAd.ad;
                        }
                        return ad;
                    });
                    localforage.setItem('ads', ads);
                }
            });
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success',
                    message: 'Ad active status changed',
                    errors: {},
                },
            });
        }
        if (!prevProps.errorReq && errorReq) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Error',
                    message: 'Please correct error below',
                    errors: errorReq,
                },
            });
        }
    }

    submitDeleteAd = () => {
        const { ad: { id } } = this.state;
        this.props.actionDeleteAd(id);
    }

    submitToggleActiveAd = () => {
        const { ad: { id, isActive } } = this.state;
        this.props.actionToggleActiveAd({ id, isActive });
    }

    handleConfirmationNotification = (event) => {
        const action = event.target.id;
        const { ad: { isActive } } = this.state;
        let message = null;
        if (action === 'deleteAd') {
            message = 'Please confirm ad delete';
        } else {
            message = `Please confirm 
                ${isActive ? 'deactivation' : 'activation'}`;
        }
        this.setState({
            notification: {
                status: 'confirm',
                title: 'Confirmation required',
                message,
                errors: {},
            },
        });
    }

    handleNotificationDismiss = (event) => {
        const { title, message } = this.state.notification;
        const { router } = this.props;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (title === 'Success' && router.pathname.includes('my-ads')) {
            router.push('/my-ads');
        } else if (title === 'Success' && router.pathname.includes('admin')) {
            router.push('/admin/ads');
        } else if (title.includes('Confirmation') && event.target.id === 'confirmed') {
            if (message.includes('delete')) {
                this.submitDeleteAd();
            } else if (message.includes('activation')) {
                this.submitToggleActiveAd();
            }
        }
    }

    render() {
        const {
            isLoadingAd,
            isLoading,
            adId,
            router,
            isAuth: { isAuthenticated },
        } = this.props;
        const { ad } = this.state;
        if (!isAuthenticated) {
            return null;
        }
        return (
            <main>
                {isLoading || isLoadingAd || !ad ? <Loading /> : null}
                {router.pathname.includes('admin') ?
                    (
                        <Breadcrumb links={[
                            { href: '/admin', text: 'admin' },
                            { href: '/admin/ads', text: 'ads' },
                            { href: null, text: adId },
                        ]}
                        />
                    ) : (
                        <Breadcrumb links={[
                            { href: '/my-ads', text: 'my-ads' },
                        ]}
                        />
                    )}
                {ad ? (
                    <>
                        <AdDetails ad={ad} isAction={false} />
                        <div className={styles.editWrap}>
                            <FormGroup>
                                <Button
                                    id="toggleActiveAd"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={this.handleConfirmationNotification}
                                >
                                    {ad.isActive ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button
                                    id="deleteAd"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={this.handleConfirmationNotification}
                                >
                                    Delete
                                </Button>
                            </FormGroup>
                            {router.pathname.includes('my-ads') ?
                                (
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Modify ad</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <AdEditForm ad={ad} />
                                        </AccordionDetails>
                                    </Accordion>
                                ) : null}
                        </div>
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

AdEdit.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    actionDeleteAd: PropTypes.func.isRequired,
    actionToggleActiveAd: PropTypes.func.isRequired,
    isLoadingAd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    adId: PropTypes.string.isRequired,
    dataGetAd: PropTypes.any,
    dataPutAd: PropTypes.any,
    dataDeleteAd: PropTypes.any,
    dataToggleActiveAd: PropTypes.any,
    errorReq: PropTypes.any,
    router: PropTypes.object.isRequired,
    isAuth: PropTypes.object.isRequired,
    ad: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionDeleteAd,
            actionToggleActiveAd,
            actionGetUserProfile,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(AdEdit)));

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
