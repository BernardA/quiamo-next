import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        backgroundColor: 'black',
        padding: '6px',
    },
    toolbar: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1),
        fontWeight: '600',
    },
    notifier: {
        marginBottom: '30px',
        maxWidth: '500px',
        margin: '0 auto',
    },
});

class NotifierInline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bkColor: '#ff9800',
            isActive: true,
            isNotClosable: false,
        };
    }

    componentDidMount() {
        this.updateState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateState();
        }
    }

    updateState = () => {
        if (this.props.isNotClosable) {
            this.setState({ isNotClosable: true });
        }
        if (this.props.severity) {
            const severity = this.props.severity;
            if (severity === 'success') {
                this.setState({ bkColor: '#4caf50' });
            } else if (severity === 'danger') {
                this.setState({ bkColor: '#f44336' });
            } else if (severity === 'info') {
                this.setState({ bkColor: '#2196f3' });
            }
        }
    }

    handleClose = () => {
        this.setState({ isActive: false });
    }

    render() {
        const { message, classes } = this.props;
        const { isActive, isNotClosable, bkColor } = this.state;
        if (isActive) {
            return (
                <AppBar
                    className={classes.notifier}
                    position="static"
                    style={{ backgroundColor: bkColor }}
                >
                    <Toolbar className={classes.toolbar}>
                        {message}
                        {
                            !isNotClosable ? (
                                <IconButton
                                    className={classes.root}
                                    color="inherit"
                                    onClick={this.handleClose}
                                    aria-label="Close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            )
                                : null
                        }
                    </Toolbar>
                </AppBar>
            );
        }
        return null;
    }
}

NotifierInline.propTypes = {
    message: PropTypes.any.isRequired,
    isNotClosable: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    severity: PropTypes.string,
};

export default withStyles(styles)(NotifierInline);
