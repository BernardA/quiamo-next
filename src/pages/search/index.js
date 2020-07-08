import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';
import {
    NavigateBefore,
    NavigateNext,
} from '@material-ui/icons/';
import axios from 'axios';
import PropTypes from 'prop-types';
import getCategories from '../../lib/getCategories';
import getCities from '../../lib/getCities';
import { Loading } from '../../components/loading';
import AdList from '../../components/adList';
import SearchAdsForm from '../../components/searchAdsForm';
import styles from '../../styles/search.module.scss';
import stylesPagination from '../../styles/pagination.module.scss';
import { actionGetAdsNext, actionGetAdsPrevious } from '../../store/actions';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAds: this.props.ads.edges,
            startCursor: null,
            endCursor: null,
            pageCount: 1,
            itemsPerPage: 10,
            selected: 0,
            isInitialLoad: true,
        };
    }

    componentDidMount() {
        const { ads } = this.props;
        this.updateState(ads, this.state.itemsPerPage);
        this.setState({ currentAds: ads.edges });
    }

    componentDidUpdate(prevProps, prevState) {
        const { dataAds } = this.props;
        if (
            (!prevProps.dataAds && dataAds) ||
            (prevProps.dataAds &&
                dataAds &&
                prevProps.dataAds.edges !== this.props.dataAds.edges)
        ) {
            this.updateState(dataAds, prevState.itemsPerPage);
        }
    }

    updateState = (ads, itemsPerPage) => {
        this.setState(() => ({
            pageCount: Math.ceil(ads.totalCount / itemsPerPage),
            startCursor: ads.pageInfo.startCursor,
            endCursor: ads.pageInfo.endCursor,
            currentAds: ads.edges,
        }));
    };

    handlePageClick = (data) => {
        const categoryParent = null;
        const categoryId = null;
        const addressId = null;
        const selected = data.selected;
        if (selected > this.state.selected) {
            const values = {
                categoryParent,
                categoryId,
                addressId,
                cursor: this.state.endCursor,
                isActive: true,
                isDeleted: false,
            };
            this.props.actionGetAdsNext(values);
        } else {
            const values = {
                categoryParent,
                categoryId,
                addressId,
                cursor: this.state.startCursor,
                isActive: true,
                isDeleted: false,
            };
            this.props.actionGetAdsPrevious(values);
        }
        this.setState({
            selected,
            isInitialLoad: false,
        });
    };

    render() {
        const {
            categories,
            cities,
            router,
            isLoading,
        } = this.props;
        const NavBefore = () => {
            return (
                <div className={stylesPagination.paginationNav}>
                    <NavigateBefore />
                </div>
            );
        };
        const NavAfter = () => {
            return (
                <div className={stylesPagination.paginationNav}>
                    <NavigateNext />
                </div>
            );
        };
        return (
            <main>
                {router.isFallback ||
                (isLoading && !this.state.isInitialLoad) ? <Loading />
                    : null}
                <div className="main-title">
                    <h1>Ads in Brazil</h1>
                </div>
                <div className={styles.content}>
                    <div className={styles.search}>
                        <SearchAdsForm
                            location={router}
                            categories={categories}
                            addresses={cities}
                        />
                        <AdList currentAds={this.state.currentAds} />
                        {this.props.ads.totalCount > this.state.itemsPerPage ? (
                            <ReactPaginate
                                previousLabel={(
                                    <NavBefore
                                        className={
                                            stylesPagination.paginationIcon
                                        }
                                    />
                                )}
                                nextLabel={(
                                    <NavAfter
                                        className={
                                            stylesPagination.paginationIcon
                                        }
                                    />
                                )}
                                breakLabel=""
                                pageCount={this.state.pageCount}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={0}
                                onPageChange={this.handlePageClick}
                                containerClassName={stylesPagination.pagination}
                                activeClassName={
                                    stylesPagination.paginationActive
                                }
                                activeLinkClassName={
                                    stylesPagination.paginationActiveLink
                                }
                                previousClassName={
                                    stylesPagination.paginationPrevious
                                }
                                nextClassName={stylesPagination.paginationNext}
                                disabledClassName={
                                    stylesPagination.paginationDisabled
                                }
                            />
                        ) : null}
                    </div>
                </div>
            </main>
        );
    }
}

Search.propTypes = {
    // params: PropTypes.object.isRequired,
    ads: PropTypes.shape({
        edges: PropTypes.array.isRequired,
        pageInfo: PropTypes.object.isRequired,
        totalCount: PropTypes.number.isRequired,
    }).isRequired,
    router: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    cities: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    actionGetAdsNext: PropTypes.func.isRequired,
    actionGetAdsPrevious: PropTypes.func.isRequired,
    dataAds: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
        searchAdsForm: state.form.SearchAdsForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetAdsNext,
            actionGetAdsPrevious,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(Search));

const queryQl = `
           query SearchMain(
               $categoryParent: String
               $categoryId: String
               $city: String
               $first: Int,
               $after: String,
               $isActive: Boolean
               $isDeleted: Boolean
           ) {
            ads(
                category_parent: $categoryParent
                category: $categoryId
                user_address_city: $city
                first: $first,
                after: $after,
                isActive: $isActive
                isDeleted: $isDeleted
            ) {
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                }
                edges {
                    node {
                        id
                        _id
                        createdAt
                        isActive
                        isDeleted
                        description
                        rentTime
                        budgetType
                        budget
                        user {
                            id
                            username
                            image {
                                filename
                            }
                            address {
                                city
                            }
                        }
                        category {
                            id
                            title
                            parent {
                                id
                                title
                            }
                            root {
                                title
                            }
                        }
                    }
                }
            }
           }
       `;

const apiQl = (data, variables = null) => {
    return axios
        .post(process.env.NEXT_PUBLIC_API_GRAPHQL_URL, {
            query: data,
            variables,
        })
        .then((response) => {
            return response.data;
        });
};

export async function getServerSideProps() {
    let categories = await getCategories();
    let cities = await getCities();
    categories = categories.data.categories;
    cities = cities.data.collectionQueryAddresses;
    const variables = {
        city: null,
        categoryParent: null,
        categoryId: null,
    };
    const data = await apiQl(queryQl, variables);
    return {
        props: {
            categories,
            cities,
            ads: data.data.ads,
        }
    }
}