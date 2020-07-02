import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Create,
    HourglassEmptyOutlined,
    CompareArrowsOutlined,
    GavelOutlined,
    SearchRounded,
    MessageRounded,
    MoodRounded,
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        color: '#2d5074',
    },
    scroller: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 300px))',
        padding: '10px',
        justifyContent: 'space-evenly',
    },
    conceptImg: {
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        '& svg': {
            width: '40px',
            height: '40px',
            marginRight: '20px',
        },
        '& div': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
        },
        '& div:last-child': {
            marginBottom: '50px',
        },
    },
    header: {
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: '1.3rem',
        textAlign: 'center',
        paddingTop: '30px',
    },
    subHeader: {
        textTransform: 'uppercase',
        fontWeight: '700',
    },
});

const Concept = (props) => {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <div>
                <Typography className={classes.header}>
                    How it works
                </Typography>
            </div>
            <div className={classes.scroller}>
                <div className={classes.conceptImg}>
                    <div>
                        <Typography className={classes.subHeader}>
                            Need something?
                        </Typography>
                    </div>
                    <div>
                        <Create />
                        <Typography>Create you ad</Typography>
                    </div>
                    <div>
                        <HourglassEmptyOutlined />
                        <Typography>
                            Wait contact from neighbors
                        </Typography>
                    </div>
                    <div>
                        <CompareArrowsOutlined />
                        <Typography>
                            Exchange with neighbors
                        </Typography>
                    </div>
                    <div>
                        <GavelOutlined />
                        <Typography>Choose best offer</Typography>
                    </div>
                    <div>
                        <MoodRounded />
                        <Typography>Enjoy</Typography>
                    </div>
                </div>
                <div className={classes.conceptImg}>
                    <div>
                        <Typography className={classes.subHeader}>
                            Willing to help?
                        </Typography>
                    </div>
                    <div>
                        <SearchRounded />
                        <Typography>Search ads</Typography>
                    </div>
                    <div>
                        <MessageRounded />
                        <Typography>Make your offer</Typography>
                    </div>
                    <div>
                        <HourglassEmptyOutlined />
                        <Typography>Wait contact</Typography>
                    </div>
                    <div>
                        <CompareArrowsOutlined />
                        <Typography>
                            Exchange with neighbor
                        </Typography>
                    </div>
                    <div>
                        <MoodRounded />
                        <Typography>Happy to help</Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

Concept.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Concept);
