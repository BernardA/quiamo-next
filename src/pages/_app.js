/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */

// example with class 
// import App from 'next/app';

// import withReduxSaga from 'next-redux-saga';
// import wrapper from '../store/reduxWrapper';

// class MyApp extends React.Component {
/* waiting response from next-redux-saga
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }
    */
/*
    render() {
        const { Component, pageProps } = this.props;
        return (
            <Component {...pageProps} />
        );
    }
}
export default wrapper.withRedux(withReduxSaga(MyApp));
*/
import withReduxSaga from 'next-redux-saga';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import wrapper from '../store/reduxWrapper';
import theme from '../styles/theme';
// eslint-disable-next-line no-unused-vars
import styles from '../styles/layout.css';
import 'react-quill/dist/quill.snow.css';
import 'react-image-crop/dist/ReactCrop.css';
import Layout from '../components/layout';

function MyApp(props) {
    console.log('MY APP PROPS', props);
    const { Component, pageProps } = props;
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout 
                    categories={pageProps.categories || []} 
                    isFallback={props.router.isFallback}
                >
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};

export default wrapper.withRedux(withReduxSaga((MyApp)));


