import Head from 'next/head';
import { withStyles } from "@material-ui/core/styles";
import {
    Card,
    CardHeader,
    CardContent,
    AppBar,
    Toolbar,
    Typography,
} from "@material-ui/core";
// import localforage from "localforage";
import PropTypes from "prop-types";
import getCategories from '../lib/getCategories';
import RecentAds from "../components/recentAds";
import AdInsert from "../components/adInsert";
import Concept from "../components/concept";
import { apiQl } from '../store/sagas';

const styles = (theme) => ({
    adForm: {
        margin: '10px',
        borderRadius: '5px',
        maxWidth: '350px',
        minHeight: '500px',
        opacity: '.7',
        [theme.breakpoints.down('sm')]: {
            width: '280px',
            margin: '0 auto',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            margin: '0 auto',
        },
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        [theme.breakpoints.down('sm')]: {
            display: 'initial',
        },
        '& > div': {
            flexGrow: 1,
        },
    },
    mainSlider: {
        position: 'absolute',
        zIndex: 0,
        top: 0,
        bottom: 0,
        height: 'auto',
        width: '100%',
    },
    appbarRoot: {
        position: 'static',
        backgroundColor: '#f64c72',
    },
    header: {
        color: '#2d5074',
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: '1.3rem',
        margin: '30px 0',
        textAlign: 'center',
    },
    title: {
        textTransform: 'uppercase',
        fontWeight: 700,
    },
});

const Home = (props) => {
    const {
        categories,
        ads,
        classes,
    } = props;
    // React.useEffect(() => localforage.setItem('categories', categories), []);
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main id="home_page">
                <div className={classes.content}>
                    <Card id="ad_insert" className={classes.adForm}>
                        <CardHeader
                            title={(
                                <AppBar className={classes.appbarRoot}>
                                    <Toolbar>
                                        <Typography className={classes.title}>
                                            What do you need?
                                        </Typography>
                                    </Toolbar>
                                </AppBar>
                            )}
                        />
                        <CardContent>
                            <AdInsert categories={categories} />
                        </CardContent>
                    </Card>
                    <div>
                        <Typography className={classes.header}>
                            Recent ads
                        </Typography>
                        <RecentAds ads={ads} />
                    </div>
                </div>
                <Concept />
            </main>
        </div>
    );
}

const queryQl = `query homePage {
    ads(
        isActive: true
        isDeleted: false
        first: 3
        after: null
    ) {
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
                        title
                    }
                    root {
                        title
                    }
                }
                budget
            }
        }
        totalCount
    }
}`;

const variables = {};
export async function getServerSideProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            categories,
            ads: data.data.ads,
        }
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    ads: PropTypes.shape({
        edges: PropTypes.array.isRequired,
    }).isRequired,
};

export default withStyles(styles)(Home);


