import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemText,
} from '@material-ui/core';
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

    const [catState, setCatState] = useState(null);
    const prevCatState = usePrevious(catState);

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
    }));
    const classes = useStyles();

    useEffect(() => {
        const cats = {};
        if (!catState || prevCatState !== categories) {
            let temp = [];
            categories.forEach((row) => {
                if (row.root && row.root.title === type &&
                    row.parent.title === type) {
                    temp.push(row.title);
                    cats[row.title] = temp;
                    temp = [];
                }
            });
            setCatState(sortObject(cats));
        }
    }, [categories]);
    if (catState) {
        return (
            <div className={classes.root}>
                <Drawer
                    id={`parentDrawer-${type}`}
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
                            >
                                <Link
                                    href="/search/[city]/[rootCategory]/[parentCategory]/[category]"
                                    as={`/search/brasil/${urlWriter(type)}/${urlWriter(text)}/0`}
                                    
                                >
                                    <ListItemText primary={text} />
                                </Link>
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
