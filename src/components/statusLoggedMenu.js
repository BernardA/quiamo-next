/* eslint-disable react/jsx-props-no-spreading */
import { withStyles } from '@material-ui/core/styles';
import {
    Menu,
    MenuItem,
    ListItemText,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Link from './link';


// from https://material-ui.com/components/menus/

const StyledMenu = withStyles((theme) => ({
    paper: {
        border: '1px solid #d3d4d5',
        minWidth: '300px',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
}))((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

const styles = {
    account: {
        height: '60px',
        width: '40px',
        color: '#fff',
        cursor: 'pointer',
    },
    menu: {
        '& a': {
            textDecoration: 'none',
            color: 'inherit',
        },
    },
    welcome: {
        cursor: 'default',
    },
};

function StatusLoggedMenu(props) {
    const { classes, logoutAction } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div>
            <AccountCircle
                className={classes.account}
                onClick={handleClick}
                aria-controls="customized-menu"
                aria-haspopup="true"
            />
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menu}
            >
                <StyledMenuItem className={classes.welcome}>
                    <ListItemText secondary="Welcome" />
                </StyledMenuItem>
                <StyledMenuItem className={classes.welcome}>
                    <ListItemText secondary={props.username} />
                </StyledMenuItem>
                <Link href="/account" onClick={handleClose}>
                    <StyledMenuItem>
                        <ListItemText primary="Account" />
                    </StyledMenuItem>
                </Link>
                <Link href="/my-ads" onClick={handleClose}>
                    <StyledMenuItem>
                        <ListItemText primary="My ads" />
                    </StyledMenuItem>
                </Link>
                <Link href="/my-bids" onClick={handleClose}>
                    <StyledMenuItem>
                        <ListItemText primary="My bids" />
                    </StyledMenuItem>
                </Link>
                {/* }
                    <Link href="/mailbox/inbox/0" onClick={handleClose}>
                        <StyledMenuItem>
                            <ListItemText primary="Mailbox" />
                        </StyledMenuItem>
                    </Link>
                { */}
                <StyledMenuItem onClick={handleClose}>
                    <ListItemText
                        onClick={logoutAction}
                        primary="Log out"
                    />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
}

StatusLoggedMenu.propTypes = {
    username: PropTypes.string.isRequired,
    logoutAction: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatusLoggedMenu);
