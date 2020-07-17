/* eslint-disable no-param-reassign */
import { 
    Card,
    CardContent,
    ButtonBase,
    GridListTile,
    GridListTileBar,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import Link from '../components/link';

const styles = (theme) => ({
    root: {
        marginBottom: '20px',
    },
    horizontal: {
        display: 'flex',
    },
    vertical: {
        display: 'grid',
        gridTemplateRows: '175px 1fr',
        height: '100%',
    },
    list: {
        display: 'grid',
        justifyContent: 'space-between',
        gridTemplateRows: '70% 30%',
        '& li': {
            display: 'initial',
            '& >div': {
                height: '100%',
                display: 'grid',
                gridTemplateRows: '60% 40%',
                justifyContent: 'space-between',
            },
        },
    },
    link: {
        width: '100%',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
    },
    imgHolder: {
        width: '175px',
        height: '175px',
        margin: '0 auto',
        [theme.breakpoints.down('xs')]: {
            width: '120px',
            height: '120px',
            margin: '0 auto',
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
});

const AdCard = (props) => {
    const {
        ad, imgPath, classes, display,
    } = props;
    if (display && display === 'vertical') {
        return (
            <Card className={classes.root}>
                <Link
                    className={classes.link}
                    href='/adview/[adId]'
                    as={`/adview/${ad._id}`}
                >
                    <CardContent className={classes.vertical}>
                        <GridListTile
                            component="div"
                            className={classes.imgHolder}
                        >
                            {
                                // if offline will throw error and get avatar
                                // placeholder
                            }
                            <LazyLoad debounce={false} offsetVertical={200}>
                                <img
                                    src={imgPath}
                                    alt={ad.user.username}
                                />
                            </LazyLoad>
                            <GridListTileBar
                                title={ad.user.username}
                                className={classes.MuiGridListTileBar}
                            />
                        </GridListTile>
                        <List className={classes.list}>
                            <ListItem>
                                <ListItemText
                                    primary={ad.category.parent.title}
                                    secondary={ad.category.title}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={ad.user.address.city} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Link>
            </Card>
        );
    }
    return (
        <Card>
            <ButtonBase component={Link} href="/adview/[adId]" as={`/adview/${ad._id}`}>
                <CardContent className={classes.horizontal}>
                    <GridListTile
                        component="div"
                        className={classes.imgHolder}
                    >
                        <LazyLoad debounce={false} offsetVertical={200}>
                            <img
                                src={imgPath}
                                alt={ad.user.username}
                            />
                        </LazyLoad>
                        <GridListTileBar title={ad.user.username} />
                    </GridListTile>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={ad.category.parent.title}
                                secondary={ad.category.title}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={ad.user.address.city} />
                        </ListItem>
                    </List>
                </CardContent>
            </ButtonBase>
        </Card>
    );
};

AdCard.propTypes = {
    classes: PropTypes.object.isRequired,
    ad: PropTypes.any,
    display: PropTypes.any,
    imgPath: PropTypes.any,
};

export default withStyles(styles)(AdCard);
