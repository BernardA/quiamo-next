import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
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
    } = props;

    const [isOpenSubDrawer, setIsOpenSubDrawer] = useState(false);
    const [currentParent, setCurrentParent] = useState(null);
    const [subDrawerTop, setSubDrawerTop] = useState(null);
    const [subDrawerHeight, setSubDrawerHeight] = useState(null);
    const [catState, setCatState] = useState(null);
    const prevCatState = usePrevious(catState);
    const prevParent = usePrevious(currentParent);

    const drawerWidth = 240;

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            position: 'absolute',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            height: 'auto',
            top: '20px',
            left: '20px',
            position: 'absolute',
            overflow: 'initial',
            paddingBottom: '30px',
        },
        subDrawerPaper: {
            width: drawerWidth,
            minHeight: subDrawerHeight,
            top: subDrawerTop,
            left: '240px',
            position: 'absolute',
            paddingBottom: '30px',
        },
    }));
    const classes = useStyles();

    useEffect(() => {
        const cats = {};
        if (!catState || prevCatState !== categories) {
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
        if (isOpenSubDrawer && document.getElementById(`subDrawer-${type}`) && currentParent !== prevParent) {
            const root = document.querySelector(`#parentDrawer-${type} > div:first-child`);
            const sub = document.querySelector(`#subDrawer-${type}`);
            const rootRect = root.getBoundingClientRect();
            const subRect = sub.getBoundingClientRect();
            // the 22 is a bit of a magic number, as I could not find exactly why the diff
            // I believe partly (20) is due to the top: 20 of the root component
            // the rest is probably padding somewhere
            setSubDrawerTop((rootRect.top + 22) - subRect.top);
            setSubDrawerHeight(rootRect.height);
        }
    }, [categories, isOpenSubDrawer, currentParent]);
    if (catState) {
        return (
            <div className={classes.root}>
                <Drawer
                    id={`parentDrawer-${type}`}
                    onMouseEnter={() => setIsOpenSubDrawer(true)}
                    onMouseLeave={() => setIsOpenSubDrawer(false)}
                    className={classes.drawer}
                    variant="persistent"
                    open={open}
                    transitionDuration={5}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Divider />
                    <List>
                        {Object.keys(catState).map((text) => (
                            <ListItem
                                className={styles.navLi}
                                id={text}
                                component="nav"
                                key={text}
                                onMouseEnter={() => setCurrentParent(text)}
                            >
                                <ListItemText primary={text} />
                                <ListItemIcon><NavigateNext /></ListItemIcon>
                                {isOpenSubDrawer && text === currentParent ?
                                    (
                                        <Drawer
                                            id={`subDrawer-${type}`}
                                            className={classes.drawer}
                                            variant="persistent"
                                            open={isOpenSubDrawer}
                                            transitionDuration={1000}
                                            classes={{
                                                paper: classes.subDrawerPaper,
                                            }}
                                        >
                                            <Divider />
                                            <List>
                                                {catState[currentParent].sort().map((item) => (
                                                    <ListItem
                                                        component="nav"
                                                        key={item}
                                                        className={styles.navLi}
                                                    >
                                                        <Link
                                                            href={`/search/france/${urlWriter(type)}/${urlWriter(currentParent)}/${urlWriter(item)}`}
                                                        >
                                                            <ListItemText primary={item} />
                                                        </Link>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Drawer>
                                    ) : null}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </div>
        );
    }
    return null;
}

NavDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};
