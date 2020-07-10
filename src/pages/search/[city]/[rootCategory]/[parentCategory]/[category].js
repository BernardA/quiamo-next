import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';
import {
    NavigateBefore,
    NavigateNext,
} from '@material-ui/icons/';
import PropTypes from 'prop-types';
import getCategories from '../../../../../lib/getCategories';
import getCities from '../../../../../lib/getCities';
import { urlWriter } from '../../../../../tools/functions';
import { Loading } from '../../../../../components/loading';
import AdList from '../../../../../components/adList';
import SearchAdsForm from '../../../../../components/searchAdsForm';
import styles from '../../../../../styles/search.module.scss';
import stylesPagination from '../../../../../styles/pagination.module.scss';
import { actionGetAdsNext, actionGetAdsPrevious } from '../../../../../store/actions';
import { ROOT_CATEGORIES } from '../../../../../parameters';

class SearchCat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAds: !this.props.router.isFallback ? this.props.ads.edges : [],
            startCursor: null,
            endCursor: null,
            pageCount: 1,
            itemsPerPage: 10,
            selected: 0,
            isInitialLoad: true,
        };
    }

    componentDidMount() {
        const { ads, router, is404 } = this.props;
        if (is404) {
            router.push('/404');
        } else if (!router.isFallback) {
            this.updateState(ads, this.state.itemsPerPage);
            this.setState({ currentAds: ads.edges });
        }
        /*
        const values = {
            cursor: null,
            isActive: true,
            isDeleted: false,
        };
        this.props.actionGetAdsNext(values);
        */
    }

    componentDidUpdate(prevProps, prevState) {
        const { dataAds, router: { isFallback, push }, is404 } = this.props;
        if (!prevProps.is404 && is404) {
            push('/404');
        }
        if (
            (!prevProps.dataAds && dataAds) ||
            (prevProps.dataAds &&
                dataAds &&
                prevProps.dataAds.edges !== this.props.dataAds.edges)
        ) {
            this.updateState(dataAds, prevState.itemsPerPage);
        }
        if (prevProps.router.isFallback && !isFallback && !is404) {
            this.updateState(this.props.ads, this.state.itemsPerPage);
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
        console.log('SEARCH PROPS', this.props);
        const {
            categories,
            cities,
            router,
            isLoading,
            is404,
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
        if (is404) {
            return <h2>IS 404</h2>;
        }
        if (router.isFallback ) {
            return <h2>IS FALLBACK</h2>;
        }
        return (
            <main>
                {isLoading && !this.state.isInitialLoad ? <Loading />
                    : null}
                <div className="main-title">
                    <h1>Ads in Brazil</h1>
                </div>
                <div className={styles.content}>
                    <div className={styles.search}>
                        <SearchAdsForm
                            router={router}
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
};

SearchCat.propTypes = {
    // params: PropTypes.object.isRequired,
    ads: PropTypes.oneOfType([
        PropTypes.shape({
            edges: PropTypes.array.isRequired,
            pageInfo: PropTypes.object.isRequired,
            totalCount: PropTypes.number.isRequired,
        }),
        PropTypes.array,
    ]),
    router: PropTypes.object.isRequired,
    categories: PropTypes.array,
    cities: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    actionGetAdsNext: PropTypes.func.isRequired,
    actionGetAdsPrevious: PropTypes.func.isRequired,
    dataAds: PropTypes.any,
    is404: PropTypes.bool,
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
)(SearchCat);

const queryQl = `
           query SearchTemplateData(
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

const validateParams = (params, categories) => {
    let is404 = false;
    const { city, rootCategory, parentCategory, category } = params;
    const main = ROOT_CATEGORIES.split(',');
    const isValidRoot = main.filter((type) => {
        return urlWriter(type) === rootCategory;
    })
    is404 = isValidRoot.length === 0;
    const regexp = /^[-a-z]+$/g
    // validate all against regexp
    // TODO consider validating city against full city list
    // always check first is is404 is not already true
    // as one false is enough to invalidate params
    is404 = !is404 && ![city.match(regexp) !== null, city === '0', city === 'brasil'].includes(true);
    is404 = !is404 && [parentCategory.match(regexp) !== null, category.match(regexp) !== null || category === '0'].includes(false);
    // detailed validation of parent categories
    if(!is404) {
        const isParent = categories.filter((cat) => {
            return cat.root && cat.root.title === cat.parent.title &&
                urlWriter(cat.title) === parentCategory;
        });
        is404 = isParent.length === 0;
        // check if root AND parent correspond
        if (!is404) {
            const isRootAndParent = categories.filter((cat) => {
                return cat.root && cat.root.title === cat.parent.title &&
                urlWriter(cat.title) === parentCategory &&
                urlWriter(cat.root.title) === rootCategory;
            })
            is404 = isRootAndParent.length === 0;
        }
    }
    // detailed validation of categories
    if(!is404 && category !== '0') {
        // check if category exists at all
        const isCat = categories.filter((cat) => {
            return cat.root && cat.root.title !== cat.parent.title &&
            urlWriter(cat.title) === category;
        })
        is404 = isCat.length === 0;
        // check if category AND parent correspond
        if (!is404) {
            const isCatAndParent = categories.filter((cat) => {
                return cat.root && cat.root.title !== cat.parent.title &&
                urlWriter(cat.parent.title) === parentCategory &&
                urlWriter(cat.title) === category;
            })
            is404 = isCatAndParent.length === 0;
        }
    }
    return is404;
}

// This function gets called at build time
export async function getStaticPaths() {
    let categories = await getCategories();
    let cities = await getCities();
    categories = categories.data.categories;
    cities = cities.data.collectionQueryAddresses;
    const paths = [];
    cities.forEach((city) => {
        categories.forEach((cat) => {
            if (cat.root && cat.root.title === cat.parent.title) {
                paths.push({
                    params: {
                        city: 'brasil',
                        rootCategory: urlWriter(cat.root.title),
                        parentCategory: urlWriter(cat.title),
                        category: '0',
                    },
                })
                paths.push({
                    params: {
                        city: urlWriter(city.city),
                        rootCategory: urlWriter(cat.root.title),
                        parentCategory: urlWriter(cat.title),
                        category: '0',
                    },
                });
            }
            if (cat.root && cat.root.title !== cat.parent.title) {
                paths.push({
                    params: {
                        city: urlWriter(city.city),
                        rootCategory: urlWriter(cat.root.title),
                        parentCategory: urlWriter(cat.parent.title),
                        category: urlWriter(cat.title),
                    },
                });
            }
        });
    });

    return {
        paths,
        fallback: true,
    };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    let categories = await getCategories();
    let cities = await getCities();
    categories = categories.data.categories;
    cities = cities.data.collectionQueryAddresses;
    const { city, parentCategory, category } = params;
    const is404 = validateParams(params, categories);

    let ads = [];
    if (!is404) { // only fetch data is params are valid
        let variables = {
            city: null,
            categoryParent: null,
            categoryId: null,
        };
        let cityObj = [];
        if (city !== 'brasil') {
            // get city as in data base
            cityObj = cities.filter((c) => {
                return urlWriter(c.city) === city;
            })
        }
        if (category === '0') {
            const parentCategoryObj = categories.filter((cat) => {
                return cat.root && cat.root.title === cat.parent.title &&
                urlWriter(cat.title) === parentCategory;
            });
            variables = {
                city: cityObj[0] && cityObj[0].city || null,
                categoryParent: parentCategoryObj[0].id,
                categoryId: null,
            };
        } else {
            const catObj = categories.filter((cat) => {
                return (
                    cat.parent &&
                    urlWriter(cat.parent.title) === parentCategory &&
                    urlWriter(cat.title) === category
                );
            });
            variables = {
                city: cityObj[0].city || null,
                categoryParent: null,
                categoryId: catObj[0].id,
            };
        }
        const data = await apiQl(queryQl, variables);
        ads = data.data.ads;
    }

    return {
        props: {
            ads,
            categories,
            cities,
            is404,
        },
    };
}
