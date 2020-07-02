import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuOpen } from '@material-ui/icons';
import localforage from 'localforage';
import { isBrowser, isMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import Link from './link';
import Status from './status';
import Nav from './nav';
import NavMobile from './navMobile';
import RgpdDialog from './rgpdDialog';
import usePrevious from '../tools/hooks/usePrevious';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    linkContainer: {
        textAlign: 'center',
    },
    link: {
        textDecoration: 'none',
        textTransform: 'uppercase',
        color: 'initial',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
    nav: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#2d5074',
        height: '60px',
        '& > div': {
            display: 'flex',
            '& > *': {
                margin: '0 10px',
            },
        },
    },
    branding: {
        justifySelf: 'start',
        width: '190px',
    },
    menuIcon: {
        height: '60px',
        width: '40px',
        color: '#fff',
        cursor: 'pointer',
    },
}));

export default function Header(props) {
    const { location, categories } = props;
    const [locationPathname, setLocationPathname] = useState(location.pathname);
    const [isRgpd, setIsRgpd] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const prevLocationPathname = usePrevious(locationPathname);

    // this.getGeo(); //DISABLED TO AVOID CHARGES/KEEP PARIS AS DEFAULT
    useEffect(() => {
        const handleRGPD = () => {
            if (prevLocationPathname !== location.pathname) {
                const isRgpdRoute = ['/', '/search'];
                localforage.getItem('isRgpd').then((value) => {
                    if (!value) {
                        // if no value in indexeddb proceed to check the route
                        setIsRgpd(!!isRgpdRoute.includes(location.pathname));
                    } else {
                        // if isRgpd is set on indexeddb, do not show dialog
                        setIsRgpd(false);
                    }
                });
            }
        };
        const handleLocationChange = () => {
            if (prevLocationPathname !== location.pathname) {
                // close mobile navigation
                setLocationPathname(location.pathname);
                setIsMobileMenuOpen(false);
            }
        };

        handleRGPD();
        handleLocationChange();

        return () => {
            handleRGPD();
            handleLocationChange();
        };
    }, [isRgpd, location]);

    const handleCloseRgpdDialog = () => {
        setIsRgpd(false);
        localforage.setItem('isRgpd', true);
    };

    const classes = useStyles();

    return (
        <>
            {isRgpd ? (
                <RgpdDialog handleCloseRgpdDialog={handleCloseRgpdDialog} />
            ) : null}
            <header>
                <div className={classes.headerTop}>
                    <Link href="/" aria-label="go to homepage">
                        <img
                            src="/images/main-logo.png"
                            alt="quiamo logo"
                            className={classes.branding}
                        />
                    </Link>
                    <div>
                        {isMobile && !isMobileMenuOpen ? (
                            <Menu
                                onClick={() => setIsMobileMenuOpen(true)}
                                className={classes.menuIcon}
                            />
                        ) : null}
                        {isMobile && isMobileMenuOpen ? (
                            <MenuOpen
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={classes.menuIcon}
                            />
                        ) : null}
                        <Status location={location} />
                    </div>
                </div>
                {isBrowser ? (
                    <Nav categories={categories} location={location} />
                ) : null}
                {isMobileMenuOpen && isMobile ? (
                    <NavMobile categories={categories} location={location} />
                ) : null}
            </header>
        </>
    );
}

Header.propTypes = {
    location: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
};
