import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import SessionHander from './sessionHandler';
// import OnlineHandler from './onlineHandler';
import styles from '../styles/layout.module.scss';


const Layout = ({ children, categories, isFallback }) => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div>
                <Header
                    siteTitle="quiamo"
                    location={router}
                    categories={categories}
                    isFallback={isFallback}
                />
                <SessionHander location={router} />
                <>{children}</>
            </div>
            <Footer />
        </div>
    );
};


Layout.propTypes = {
    children: PropTypes.node.isRequired,
    categories: PropTypes.array.isRequired,
    isFallback: PropTypes.bool.isRequired,
};

export default Layout;
