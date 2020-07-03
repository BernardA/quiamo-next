import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AdCard from './adCard';
import { 
    USER_IMAGE_DIRECTORY,
    AVATAR_PLACEHOLDER_PATH,
} from '../parameters';

const styles = (theme) => ({
    scroller: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 180px))',
        padding: '10px',
        justifyContent: 'space-evenly',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            margin: '0 auto',
            maxWidth: '280px',
        },
    },
    conceptImg: {
        maxWidth: '230px',
        margin: '0 auto',
    },
});

const RecentAds = (props) => {
    const { ads, classes } = props;
    const adList = () => {
        const tags = ads.edges.map((ad) => {
            // if user has no img on profile, get placeholder img
            let imgPath = `${process.env.NEXT_PUBLIC_API_HOST}${AVATAR_PLACEHOLDER_PATH}`;
            if (ad.node.user.image) {
                imgPath = `${process.env.NEXT_PUBLIC_API_HOST}${USER_IMAGE_DIRECTORY}${ad.node.user.image.filename}`;
            }
            return (
                <AdCard
                    key={ad.node.id}
                    ad={ad.node}
                    imgPath={imgPath}
                    display="vertical"
                />
            );
        });
        return tags;
    };
    if (ads.edges.length > 0) {
        return (
            <div className={classes.scroller}>
                {adList()}
            </div>
        );
    }
    return null;
};

RecentAds.propTypes = {
    ads: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecentAds);
