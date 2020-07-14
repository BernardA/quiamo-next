import React, { useState, useEffect } from 'react';
import { MenuList, MenuItem } from '@material-ui/core';
import { withCookies, Cookies } from 'react-cookie';
import { ExpandMore } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';
import styles from '../styles/nav.module.scss';
import NavDrawer from './navDrawer';
import usePrevious from '../tools/hooks/usePrevious';
import { ROOT_CATEGORIES } from '../parameters';

const Nav = (props) => {
    const { cookies, categories, router } = props;
    const [isOpenProductsMenu, setIsOpenProductsMenu] = useState(false);
    const [isOpenServicesMenu, setIsOpenServicesMenu] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
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
                setIsOpenProductsMenu(false);
                setIsOpenServicesMenu(false);
            }
        };
        handleLocationChange();
        return () => {
            handleLocationChange();
        };
    }, [router]);

    return (
        <MenuList className={styles.navGrid} style={{ padding: '0 10px 0 0' }}>
            <MenuItem disableGutters>
                <Link href="/">Home</Link>
            </MenuItem>
            <MenuItem disableGutters>
                <Link href="/search">Search</Link>
            </MenuItem>
            { !router.isFallback ? 
                (
                    <MenuItem
                        onMouseEnter={() => setIsOpenProductsMenu(true)}
                        onMouseLeave={() => setIsOpenProductsMenu(false)}
                        className={styles.overrideItem}
                        disableGutters
                    >
                        <NavDrawer
                            type={main[0]}
                            open={isOpenProductsMenu}
                            categories={categories}
                        />
                        <Link href="/"  onClick={(event) => event.preventDefault}>
                            <div className={styles.itemWrap}>
                                {main[0]}
                                <ExpandMore />
                            </div>
                        </Link>
                    </MenuItem>
                ): null}
            { !router.isFallback ?
                (
                    <MenuItem
                        onMouseEnter={() => setIsOpenServicesMenu(true)}
                        onMouseLeave={() => setIsOpenServicesMenu(false)}
                        className={styles.overrideItem}
                        disableGutters
                    >
                        <NavDrawer
                            type={main[1]}
                            open={isOpenServicesMenu}
                            categories={categories}
                        />
                        <Link href="/"  onClick={(event) => event.preventDefault}>
                            <div className={styles.itemWrap}>
                                {main[1]}
                                <ExpandMore />
                            </div>
                        </Link>
                    </MenuItem>
                ): null}
            {isAdmin ?
                (
                    <MenuItem disableGutters>
                        <Link href="/admin">Admin</Link>
                    </MenuItem>
                ) : null}
        </MenuList>
    );
};

Nav.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    categories: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
};

export default withCookies(Nav);
