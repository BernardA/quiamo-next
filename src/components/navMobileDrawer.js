import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemText,
    ListItemIcon,
    AppBar,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { NavigateNext, Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';
import usePrevious from '../tools/hooks/usePrevious';
import { sortObject, urlWriter } from '../tools/functions';
import styles from '../styles/nav.module.scss';

export default function NavDrawer(props) {
    const {
        type,
        open,
        categories,
        toggleMenu,
    } = props;

    const [isOpenSubDrawer, setIsOpenSubDrawer] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(open);
    const [currentParent, setCurrentParent] = useState(null);
    const [catState, setCatState] = useState(categories);
    const prevCatState = usePrevious(catState);
    const prevIsOpenDrawer = usePrevious(isOpenDrawer);
    const prevIsOpenSubDrawer = usePrevious(isOpenSubDrawer);

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
        },
        drawerRoot: {
            position: 'inherit',
        },
        drawerPaper: {
            top: '60px',
            left: 0,
            width: '100%',
            paddingBottom: '30px',
        },
        subDrawerPaper: {
            left: 0,
            top: '60px',
            width: '100%',
            paddingBottom: '30px',
        },
        appbarRoot: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
    }));
    const classes = useStyles();
    useEffect(() => {
        const cats = {};
        if (prevCatState !== categories) {
            let temp = [];
            categories.forEach((row) => {
                if (row.root && row.root.title === type &&
                    row.parent.title === type) {
                    categories.forEach((row1) => {
                        if (row1.parent && row1.parent.title === row.title &&
                            row1.root.title === type) {
                            temp.push(row1.title);
                        }
                    });
                    cats[row.title] = temp;
                    temp = [];
                }
            });
            setCatState(sortObject(cats));
        }
        const changeDrawer = () => {
            if (!prevIsOpenDrawer && isOpenDrawer) {
                setIsOpenDrawer(true);
                setTimeout(() => {
                    const drawer = document.getElementById(`parentDrawer-${type}`);
                    drawer.style.position = 'inherit';
                }, 1000);
            }
        };
        const changeSubDrawer = () => {
            if (!prevIsOpenSubDrawer && isOpenSubDrawer) {
                setTimeout(() => {
                    const drawer = document.getElementById(`subDrawer-${type}`);
                    drawer.style.position = 'inherit';
                }, 1000);
            }
        };
        changeDrawer();
        changeSubDrawer();
    }, [categories, open, isOpenSubDrawer]);
    const handleCategorySelect = (text) => {
        setCurrentParent(text);
        setIsOpenSubDrawer(true);
    };
    return (
        <div className={classes.root}>
            <Drawer
                id={`parentDrawer-${type}`}
                variant="temporary"
                open={open}
                transitionDuration={5}
                classes={{
                    root: classes.drawerRoot,
                    paper: classes.drawerPaper,
                }}
            >
                <Divider />
                <List>
                    <ListItem>
                        <div className={classes.appbarRoot}>
                            <AppBar position="static">
                                <Toolbar>
                                    <Typography variant="h6" className={classes.title}>
                                        Categorias
                                    </Typography>
                                    <Close onClick={toggleMenu(false)} fontSize="small" />
                                </Toolbar>
                            </AppBar>
                        </div>
                    </ListItem>
                    {Object.keys(catState).map((text) => (
                        <ListItem
                            className={styles.navLi}
                            id={text}
                            component="nav"
                            key={text}
                            onClick={() => handleCategorySelect(text)}
                        >
                            <ListItemText primary={text} />
                            <ListItemIcon><NavigateNext /></ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {isOpenSubDrawer ?
                (
                    <Drawer
                        id={`subDrawer-${type}`}
                        variant="temporary"
                        open
                        // transitionDuration={1000}
                        classes={{
                            paper: classes.subDrawerPaper,
                        }}
                    >
                        <Divider />
                        <List>
                            <ListItem>
                                <div className={classes.appbarRoot}>
                                    <AppBar position="static">
                                        <Toolbar>
                                            <Typography variant="h6" className={classes.title}>
                                                {currentParent}
                                            </Typography>
                                            <Close onClick={() => setIsOpenSubDrawer(false)} fontSize="small" />
                                        </Toolbar>
                                    </AppBar>
                                </div>
                            </ListItem>
                            {catState[currentParent].sort().map((item) => (
                                <ListItem
                                    component="nav"
                                    key={item}
                                    className={styles.navLi}
                                >
                                    <Link
                                        href="/search/[city]/[rootCategory]/[parentCategory]/[category]"
                                        as={`/search/france/${urlWriter(type)}/${urlWriter(currentParent)}/${urlWriter(item)}`}
                                        
                                    >
                                        <ListItemText primary={item} />
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>
                ) : null}
        </div>
    );
}

NavDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    toggleMenu: PropTypes.func,
};
