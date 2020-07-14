import { withStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Button,
    GridListTile,
    GridListTileBar,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import NotifierInline from './notifierInline';
import { showtime } from '../tools/functions';
import {
    AVATAR_PLACEHOLDER_PATH,
    USER_IMAGE_DIRECTORY,
    LOCALE,
    CURRENCY,
} from '../parameters';
import Link from './link';

const styles = () => ({
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
    },
    MuiGridListTile: {
        '& >div': {
            height: '250px',
            width: '250px',
            margin: '0 auto',
        },
    },
    adInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(240px,auto))',
    },
    messageViewer: {
        maxHeight: '200px',
        p: {
            marginTop: 0,
            marginBottom: 0,
        },
        li: {
            listStyleType: 'disc',
        },
    },
    item: {
        p: {
            display: 'inline',
            marginLeft: '10px',
        },
    },
    MuiGridListTileBar: {
        color: '#121212',
        '& > div': {
            fontWeight: '600',
            fontSize: '.9rem',
            color: '#90caf9',
        },
    },
    description: {
        flexDirection: 'column',
        alignItems: 'baseline',
        '& > div': {
            color: 'rgba(0, 0, 0, 0.54)',
        },
    },
});

const AdDetails = (props) => {
    const {
        ad, 
        userProfile, 
        isAction, 
        classes,
        router,
    } = props;
    // if user has no img on profile, get placeholder img
    let imgPath = `${process.env.API_HOST}${AVATAR_PLACEHOLDER_PATH}`;
    if (ad.user.image) {
        imgPath = `${process.env.API_HOST}${USER_IMAGE_DIRECTORY}${ad.user.image.filename}`;
    }
    const isAlreadyBid = () => {
        const isAd = userProfile.bids.length > 0 && userProfile.bids.filter((bid) => {
            return bid.ad._id === ad._id;
        });
        return isAd.length > 0;
    };
    const budgetAd = () => {
        if (!ad.budget) {
            return ad.budgetType;
        }
        const budget = new Intl.NumberFormat(LOCALE, {
            style: 'currency',
            currency: CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(ad.budget);
        if (ad.rentTime) {
            return `${budget}/day`;
        }
        return `${budget}${ad.budgetType ? `/${ad.budgetType}` : ''}`;
    };
    if (Object.keys(ad).length > 0) {
        return (
            <Card>
                <CardContent className={classes.adInfo}>
                    <GridListTile className={classes.MuiGridListTile}>
                        <img
                            src={imgPath}
                            onError={(event) => {
                                // eslint-disable-next-line no-param-reassign
                                event.target.src = AVATAR_PLACEHOLDER_PATH;
                            }}
                            alt={ad.user.username}
                        />
                        <GridListTileBar
                            className={classes.MuiGridListTileBar}
                            title={ad.user.username}
                        />
                    </GridListTile>
                    <List>
                        <ListItem>
                            <ListItemText
                                className={classes.item}
                                primary={`${ad.category.parent.title}:`}
                                secondary={ad.category.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                className={classes.item}
                                primary="City"
                                secondary={ad.user.address.city}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                className={classes.item}
                                primary="Published at"
                                secondary={showtime(ad.createdAt)}
                            />
                        </ListItem>
                        {ad.rentTime ? (
                            <ListItem>
                                <ListItemText
                                    className={classes.item}
                                    primary="Rental time"
                                    secondary={`${ad.rentTime} ${
                                        ad.rentTime === 1 ? 'day' : 'days'
                                    }`}
                                />
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <ListItemText
                                className={classes.item}
                                primary="Budget"
                                secondary={budgetAd()}
                            />
                        </ListItem>
                        <ListItem className={classes.description}>
                            <Typography component="span">Description</Typography>
                            <div>{ ReactHtmlParser(ad.description)}</div>
                        </ListItem>
                    </List>
                </CardContent>
                {isAction ? (
                    <CardActions>
                        {!userProfile || !isAlreadyBid() ? (
                            <Link
                                href={{
                                    pathname: '/bid/[adId]',
                                    query: {
                                        adViewPath: router.pathname
                                    }
                                }}
                                as={`/bid/${ad._id}`}
                                
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Make offer
                                </Button>
                            </Link>
                        ) : (
                            <NotifierInline isNotClosable message="You already bid for this ad, thanks!" />
                        )}
                    </CardActions>
                ) : null}
            </Card>
        );
    }
    return null;
};

AdDetails.propTypes = {
    ad: PropTypes.object.isRequired,
    userProfile: PropTypes.any,
    isAction: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdDetails);