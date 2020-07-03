import { withStyles } from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons';

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%',
    },
    MuiAccordionDetails: {
        width: '300px',
        height: '300px',
        margin: '0 auto',
    },
});

const UserProfileImage = (props) => {
    const { classes, userProfile, isAdmin } = props;
    if (userProfile.image) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <Typography className={classes.heading}>Image</Typography>
                </AccordionSummary>
                <AccordionDetails
                    className={classes.MuiAccordionDetails}
                >
                    <Paper className={classes.paper}>
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/user/${userProfile.image.filename}`}
                            alt="user profile"
                        />
                    </Paper>
                </AccordionDetails>
            </Accordion>
        );
    }
    return isAdmin ? 'No profile image' : 'You do not have a profile image';
};

export default withStyles(styles)(UserProfileImage);
