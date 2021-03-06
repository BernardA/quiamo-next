import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import SessionHander from './sessionHandler';
// import OnlineHandler from './onlineHandler';
import styles from '../styles/layout.module.scss';


const Layout = ({ children, categories }) => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div>
                <Header
                    siteTitle="quiamo"
                    router={router}
                    categories={categories}
                />
                <SessionHander router={router} />
                <>{children}</>
            </div>
            <Footer />
        </div>
    );
};


Layout.propTypes = {
    children: PropTypes.node.isRequired,
    categories: PropTypes.array.isRequired,
};

export default Layout;
