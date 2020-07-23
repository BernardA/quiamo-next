import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    Divider,
} from '@material-ui/core';
import { withCookies, Cookies } from 'react-cookie';
import { NavigateNext } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';
import styles from '../styles/nav.module.scss';
import NavMobileDrawer from './navMobileDrawer';
import usePrevious from '../tools/hooks/usePrevious';
import { ROOT_CATEGORIES,LANG } from '../parameters';

const trans = {
    br: {
        search: 'Busca',
    },
    en: {
        search: 'Search',
    }
}

const NavMobile = (props) => {
    const { cookies, categories, router } = props;
    const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentType, setCurrentType] = useState(null);
    const [routerPathname, setRouterPathname] = useState(router.pathname);
    const prevRouterPathname = usePrevious(routerPathname);
    const main = ROOT_CATEGORIES.split(',');

    useEffect(() => {
        if (cookies.get('roles')) {
            const roles = cookies.get('roles');
            setIsAdmin(!!roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPERADMIN'));
        }
        const handleLocationChange = () => {
            if (prevRouterPathname !== router.pathname) {
                setRouterPathname(router.pathname);
                const listItems = document.querySelectorAll('.activable');
                listItems.forEach((item) => {
                    if (item.id === router.pathname) {
                        item.classList.add(`${styles.activeList}`);
                    } else {
                        item.classList.remove(`${styles.activeList}`);
                    }
                });
            }
        };
        handleLocationChange();
        return () => {
            handleLocationChange();
        };
    }, [router]);
    const toggleCategoryMenu = (isOpen, type = null) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setCurrentType(type);
        setIsOpenCategoryMenu(isOpen);
    };
    return (
        <List className={styles.navMobile}>
            <ListItem id="/" className="activable">
                <Link href="/">Home</Link>
            </ListItem>
            <ListItem id="/search" className="activable">
                <Link href="/search">{trans[LANG].search}</Link>
            </ListItem>
            { !router.isFallback ? 
                (
                    <ListItem
                        onClick={toggleCategoryMenu(true, main[0])}
                        className={styles.overrideItem}
                    >
                        <Link className={styles.disabledLink} href="/">
                            <div>
                                <span>{main[0]}</span>
                                <NavigateNext fontSize="small" />
                            </div>
                        </Link>
                    </ListItem>
                ): null}
            { !router.isFallback ? 
                (
                    <ListItem
                        onClick={toggleCategoryMenu(true, main[1])}
                    >
                        <Link className={styles.disabledLink} href="/">
                            <div>
                                <span>{main[1]}</span>
                                <NavigateNext fontSize="small" />
                            </div>
                        </Link>
                    </ListItem>
                ): null}
            <Divider />
            {isAdmin ?
                (
                    <ListItem>
                        <Link href="/admin">Admin</Link>
                    </ListItem>
                ) : null}
            {
                isOpenCategoryMenu ?
                    (
                        <NavMobileDrawer
                            type={currentType}
                            open
                            categories={categories}
                            toggleMenu={toggleCategoryMenu}
                        />
                    ) : null
            }
        </List>
    );
};

NavMobile.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    categories: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
};

export default withCookies(NavMobile);
