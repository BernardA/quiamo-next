import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import { AccountCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';
import { actionLogoutInit } from '../store/actions';
import styles from '../styles/status.module.scss';
import LoggedMenu from './statusLoggedMenu';


// const overrideStyle = {
//    justifyContent: 'space-evenly',
// };

class Status extends React.Component {
    render() {
        const { cookies, router } = this.props;
        const username = cookies.get('username') || false;
        return (
            <div className={styles.status}>
                {
                    username ?
                        (
                            <div className={styles.signer}>
                                <LoggedMenu
                                    username={username}
                                    logoutAction={this.props.actionLogoutInit}
                                />
                            </div>
                        ) : null
                }
                {
                    !username && !router.pathname.includes('login') ?
                        (
                            <div className={styles.signer}>
                                <Link
                                    href="/login"
                                    
                                >
                                    <AccountCircle
                                        aria-controls="customized-menu"
                                        aria-haspopup="true"
                                    />
                                </Link>
                            </div>
                        ) : null
                }
            </div>
        );
    }
}

Status.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionLogoutInit: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionLogoutInit,
        },
        dispatch,
    );
}

export default withCookies(connect(null, mapDispatchToProps)(Status));
