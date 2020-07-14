import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Chip,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import {
    PersonOutline,
    DeleteOutlined,
    NotInterestedOutlined,
    ThumbDownOutlined,
    ReplyOutlined,
    ExpandMore,
    CallReceivedOutlined,
    CallMadeOutlined,
} from '@material-ui/icons';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import MessageForm from './mailboxMessageForm';
import NotifierDialog from './notifierDialog';
import { showtime } from '../tools/functions';
import styles from '../styles/mailbox.module.scss';
import Link from './link';


class MessageDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActiveReply: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    handleReply = () => {
        const { userProfile, messageContent } = this.props;
        const senderId = messageContent.sender.id;
        const isBlocked = userProfile.blockedUsers.filter((sender) => {
            return sender.blocked.id === senderId;
        });
        if (isBlocked.length === 0) {
            this.setState({
                isActiveReply: true,
            });
        } else {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Cannot reply',
                    message: 'You blocked or were blocked by this user',
                    errors: {},
                },
            });
        }
    };

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    render() {
        const {
            router,
            messageContent,
            handleMessageStatusUpdate,
            handleMessageReportNotification,
            handleUserBlockNotification,
            routeParams,
            userProfile,
        } = this.props;
        const { isActiveReply } = this.state;

        const showAttachment = (message) => {
            if (message.attachments.length > 0) {
                return message.attachments.map((attachment) => {
                    return (
                        <TableRow key={attachment.filename} id="attach_dialog">
                            <TableCell>
                                <Link
                                    href={{
                                        pathname: '/viewer/message',
                                        query: {
                                            fileName: attachment.filename,
                                            mailbox: routeParams.type,
                                            messageId: message._id,  
                                        }
                                    }}
                                    
                                >
                                    {attachment.filename}
                                </Link>
                            </TableCell>
                        </TableRow>
                    );
                });
            }
            return null;
        };

        const showThread = (thread) => {
            const list = thread[0].children;
            return list.map((message, index) => {
                const messageCount = list.length - index;
                return (
                    <ExpansionPanel
                        key={message.id}
                        // id={`message_all_${index}`}
                        className={styles.threadRoot}
                    >
                        <ExpansionPanelSummary
                            // id={`message_top_${index}`}
                            className={styles.MuiExpansionPanelSummary}
                            expandIcon={<ExpandMore />}
                            // onClick={event => {
                            //    toggleThreadOld(event);
                            // }}
                        >
                            <div className={styles.threadTab}>
                                <span>
                                    <Chip
                                        className={styles.noClick}
                                        label={`${messageCount}/${list.length}`}
                                    />
                                </span>
                                <Typography
                                    component="p"
                                >
                                    {message.sender.id ===
                                    this.props.userProfile.id
                                        ? <CallMadeOutlined title="sent" aria-label="sent" />
                                        : <CallReceivedOutlined title="received" aria-label="received" />}
                                </Typography>
                                <Typography
                                    className={styles.sentAt}
                                    component="p"
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    {showtime(message.sentAt)}
                                </Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails
                            // id={`message_bottom_${index}`}
                            className={styles.MuiExpansionPanelDetails}
                        >
                            <div className={styles.messageViewer}>
                                {ReactHtmlParser(message.message)}
                            </div>
                            <div className={styles.attachment}>
                                <Table>
                                    <TableBody>
                                        {showAttachment(message)}
                                    </TableBody>
                                </Table>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            });
        };
        const message = messageContent;
        const correspondent = routeParams.type === 'inbox' ? message.sender.username : message.receiver.username;
        const indexOnThread = () => {
            let ind = 0;
            message.thread[0].children.forEach((item, index) => {
                if (item.id === message.id) {
                    ind = index;
                }
            });
            return message.thread[0].children.length - ind;
        };

        return (
            <div>
                <AppBar position="static">
                    <Toolbar className={styles.root}>
                        <div>
                            <PersonOutline className={styles.personIcon} />
                            <Typography
                                className={styles.date}
                                variant="subtitle2"
                                gutterBottom
                            >
                                {correspondent}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                className={styles.subject}
                                variant="subtitle1"
                                gutterBottom
                            >
                                {`Subject: ${message.subject}`}
                            </Typography>
                        </div>
                        {routeParams.type === 'inbox' ? (
                            <div className={styles.actions}>
                                <IconButton
                                    id={`choices_reply_${message._id}`}
                                    onClick={this.handleReply}
                                    title="Reply"
                                >
                                    <ReplyOutlined className={styles.noClick} />
                                </IconButton>
                                <IconButton
                                    id={`choices_report_${message._id}`}
                                    onClick={handleMessageReportNotification}
                                    title="Report this message"
                                >
                                    <ThumbDownOutlined
                                        className={styles.noClick}
                                    />
                                </IconButton>
                                <IconButton
                                    id={`choices_block_${message._id}`}
                                    onClick={handleUserBlockNotification}
                                    title="Block this user"
                                >
                                    <NotInterestedOutlined
                                        className={styles.noClick}
                                    />
                                </IconButton>
                                <IconButton
                                    id={`choices_delete_${message._id}`}
                                    onClick={handleMessageStatusUpdate}
                                    title="Delete"
                                >
                                    <DeleteOutlined
                                        className={styles.noClick}
                                    />
                                </IconButton>
                            </div>
                        ) : (
                            <IconButton
                                id={`choices_delete_${message._id}`}
                                onClick={handleMessageStatusUpdate}
                                title="Delete"
                            >
                                <DeleteOutlined className={styles.noClick} />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>
                <div className={styles.messagesAll}>
                    {routeParams.type === 'inbox' && message.thread ? (
                        <div className={styles.threadTab}>
                            <span>
                                <Chip
                                    className={styles.noClick}
                                    label={`${indexOnThread()}/${message.thread[0].children.length}`}
                                />
                            </span>
                            <Typography
                                component="p"
                                className={styles.messageViewer}
                            >
                                {message.sender.id === this.props.userProfile.id
                                    ? <CallMadeOutlined title="sent" aria-label="sent" />
                                    : <CallReceivedOutlined title="received" aria-label="received" />}
                            </Typography>
                            <Typography
                                component="p"
                                className={styles.sentAt}
                                variant="subtitle1"
                                gutterBottom
                            >
                                {showtime(message.sentAt)}
                            </Typography>
                        </div>
                    ) : (
                        <Typography variant="subtitle1" gutterBottom>
                            {showtime(message.sentAt)}
                        </Typography>
                    )}
                    <div className={styles.currentMessage}>
                        <div className={styles.messageViewer}>
                            {ReactHtmlParser(message.message)}
                        </div>
                        <div id={`message_attachment_${message._id}`}>
                            <Table>
                                <TableBody>{showAttachment(message)}</TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div>
                    {isActiveReply ? (
                        <MessageForm
                            isActiveReply={isActiveReply}
                            routeParams={routeParams}
                            originalMessage={messageContent}
                            userProfile={userProfile}
                            router={router}
                        />
                    ) : null}
                </div>
                <div>
                    {routeParams.type === 'inbox' && message.thread
                        ? showThread(message.thread)
                        : null}
                </div>
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </div>
        );
    }
}

MessageDetails.propTypes = {
    messageContent: PropTypes.object,
    router: PropTypes.object.isRequired,
    handleMessageStatusUpdate: PropTypes.func.isRequired,
    handleMessageReportNotification: PropTypes.func.isRequired,
    handleUserBlockNotification: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired,
};

export default MessageDetails;
