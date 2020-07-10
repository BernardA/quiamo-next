import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import MailboxChoices from '../../../components/mailboxChoices';
import NotifierDialog from '../../../components/notifierDialog';
import MessageForm from '../../../components/mailboxMessageForm';
import Inoutbox from '../../../components/mailboxInoutbox';
import MessageDetails from '../../../components/mailboxMessageDetails';
import {
    actionGetMailbox,
    actionGetUserProfile,
    actionPutMessageUpdateStatus,
    actionPostBlockUser,
} from '../../../store/actions';
import { Loading } from '../../../components/loading';
import getCategories from '../../../lib/getCategories';
import { handlePrivateRoute } from '../../../tools/functions';

class MailboxHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActiveNewMessage: false,
            isLoadingLocal: false,
            allMessages: [],
            messageContent: null,
            userProfile: null,
            mailbox: null,
            reportedMessageId: null,
            blockedUserId: null,
            routeParams: {
                type: 'inbox',
                messageId: 0,
            },
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        this.updateLocalState();
        const { type, messageId } = this.props;
        this.setState({
            routeParams: {
                type,
                messageId,
            },
        });
        if (type === 'new-message') {
            this.setState({ isActiveNewMessage: true });
        }
        if (this.state.allMessages.length === 0 && this.state.userProfile && this.state.mailbox) {
            this.setMessages();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            type,
            messageId,
            dataMailbox,
            cookies,
            userProfile,
            dataBlockUser,
            errorBlockUser,
            router,
        } = this.props;
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                isActiveNewMessage: false,
                messageContent: null,
                allMessages: [],
                routeParams: {
                    type,
                    messageId,
                },
            });
            this.setMessages();
            if (type === 'new-message') {
                this.setState({ isActiveNewMessage: true });
            } else if (prevState.routeParams.type === 'new-message') {
                // if coming from new message, fetch data from remote
                this.props.actionGetMailbox(cookies.get('userId'));
            }
        }
        if ((!prevProps.dataMailbox && dataMailbox) ||
            (!prevProps.userProfile && userProfile) ||
            (prevProps.userProfile && prevProps.userProfile !== userProfile)) {
            if (dataMailbox && userProfile) {
                this.updateLocalState();
            }
        }
        if ((!prevState.mailbox && this.state.mailbox) ||
            (prevState.mailbox && prevState.mailbox !== this.state.mailbox) ||
            (!prevState.userProfile && this.state.userProfile) ||
            (prevState.userProfile && prevState.userProfile !== this.state.userProfile)) {
            if (this.state.userProfile && this.state.mailbox) {
                this.setMessages();
            }
        }
        if (!prevProps.dataStatusMessage && this.props.dataStatusMessage) {
            const {
                id, readAt, isDeletedByReceiver, isDeletedBySender, isReported,
            } = this.props.dataStatusMessage.message;
            const mailbox = prevState.mailbox;
            const { inbox, outbox } = mailbox;
            let box = inbox;
            if (this.state.routeParams.type === 'outbox') {
                box = outbox;
            }
            let isDelete = false;
            let newBox = box.map((mess) => {
                const temp = mess;
                if (temp.id === id) {
                    temp.readAt = readAt;
                    temp.isReported = isReported;
                    if (temp.isDeletedByReceiver !== isDeletedByReceiver ||
                        temp.isDeletedBySender !== isDeletedBySender) {
                        isDelete = true;
                    }
                }
                return temp;
            });
            let boxWithoutDeleted = null;
            // if is delete, delete message from box
            if (isDelete) {
                this.setState({ isLoadingLocal: false });
                boxWithoutDeleted = newBox.filter((mess) => {
                    return mess.id !== id;
                });
            }
            if (boxWithoutDeleted) {
                newBox = boxWithoutDeleted;
            }
            if (this.state.routeParams.type === 'inbox') {
                mailbox.inbox = newBox;
            } else {
                mailbox.outbox = newBox;
            }
            this.setState({ mailbox });
            if (this.state.reportedMessageId) {
                this.setState({
                    notification: {
                        status: 'ok_and_dismiss',
                        title: 'Message reported, thanks',
                        message: 'We will take appropriate action.',
                        errors: {},
                    },
                });
            }
            // if message deleted, navigate to inbox
            if (isDelete) {
                router.push('/mailbox/inbox/0');
            } else {
                this.setMessages();
            }
        }
        if (!prevProps.errorBlockUser && errorBlockUser) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Error',
                    message: 'There was an error please try again',
                    errors: {},
                },
            });
        }
        if (!prevProps.dataBlockUser && dataBlockUser) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success, user blocked',
                    message: 'You can unblock it in your account page',
                    errors: {},
                },
            });
            this.props.actionGetUserProfile(cookies.get('userId'));
        }
    }

    updateLocalState = () => {
        const { cookies } = this.props;
        const userId = cookies.get('userId');
        // get from props
        let userProfile = this.props.userProfile || null;
        if (this.props.dataMailbox) {
            const {
                dataMailbox: {
                    retrievedQueryUser: { inbox, outbox },
                    collectionQueryMessages,
                },
            } = this.props;
            this.setState({
                userProfile,
                mailbox: {
                    inbox,
                    outbox,
                    threads: collectionQueryMessages,
                },
            });
        } else {
            this.setState({
                userProfile,
                mailbox: null,
            });
        }

        // if not, get from indexeddb
        if (!userProfile) {
            localforage.getItem('userProfile').then((profile) => {
                userProfile = profile || null;
                localforage.getItem('mailbox').then((box) => {
                    if (box) {
                        const {
                            retrievedQueryUser: { inbox, outbox },
                            collectionQueryMessages,
                        } = box;
                        this.setState({
                            userProfile,
                            mailbox: {
                                inbox,
                                outbox,
                                threads: collectionQueryMessages,
                            },
                        });
                    }
                });
            });
            // refresh props SWR => stale while revalidate
            this.props.actionGetUserProfile(userId);
            this.props.actionGetMailbox(userId);
        }
    }

    setMessages = () => {
        const { mailbox: { inbox, outbox, threads } } = this.state;
        const { type, messageId } = this.props;
        // set all messages = outbox and change if inbox
        let allMessages = outbox;
        let inb = [];
        if (type === 'inbox') {
            const parents = [];
            // remove messages with same parent
            inb = inbox.filter((item) => {
                let isReturn = !item.parent || parents.indexOf(item.parent.id) === -1;
                if (item.parent) {
                    parents.push(item.parent.id);
                }
                if (item.children.length > 0 && parents.indexOf(item.id) !== -1) {
                    parents.push(item.id);
                    isReturn = false;
                }
                return isReturn;
            });
            // add thread as a property of the message
            if (threads.length > 0) {
                inb.map((item) => {
                    const temp = item;
                    // if message has parent, add thread
                    if (item.parent) {
                        const thread = threads.filter((par) => {
                            return par.id === item.parent.id;
                        });
                        if (thread[0].children &&
                            thread[0].children[thread[0].children.length - 1].id
                            !== item.parent.id) {
                            thread[0].children.push(thread[0]);
                        }
                        temp.thread = thread;
                    } else { // add thread to the parent message
                        const thread = threads.filter((mess) => {
                            return mess._id === item._id;
                        });
                        if (thread.length > 0) {
                            if (thread[0].children &&
                                thread[0].children[thread[0].children.length - 1].id
                                !== item.id) {
                                thread[0].children.push(thread[0]);
                            }
                            temp.thread = thread;
                        }
                    }
                    return temp;
                });
            }
            allMessages = inb;
        }
        let messageContent = null;
        if (parseInt(messageId, 10) !== 0) {
            const message = allMessages.filter((mess) => {
                return mess._id === parseInt(messageId, 10);
            });
            messageContent = message[0];
        }
        this.setState({
            allMessages,
            messageContent,
        });
    };

    handleMessageStatusUpdate = (event = null, messageId = null) => {
        let messId = messageId;
        let isDelete = false;
        let isReport = false;
        if (this.state.reportedMessageId) {
            messId = this.state.reportedMessageId;
            isReport = true;
        }
        if (!messId) { // if still no message id, then its delete
            isDelete = true;
            messId = event.target.id.replace('choices_delete_', '');
        }
        const { allMessages } = this.state;
        const { type } = this.state.routeParams;
        const message = allMessages.filter((mess) => {
            return mess._id === parseInt(messId, 10);
        });
        const isRead = !isDelete && !isReport && !message[0].readAt;
        // if is delete set loading
        if (isDelete) {
            this.setState({ isLoadingLocal: true });
        }
        if (isDelete || isReport || isRead) {
            const values = {
                id: messId,
                readAt: isRead ? new Date().toISOString() : message[0].readAt,
                isDeletedBySender: isDelete && type === 'outbox' ? true : message[0].isDeletedBySender,
                isDeletedByReceiver: isDelete && type === 'inbox' ? true : message[0].isDeletedByReceiver,
                isReported: isReport,
            };
            this.props.actionPutMessageUpdateStatus(values);
        }
    }

    handleMessageReportNotification = (event) => {
        const messId = event.target.id.replace('choices_report_', '');
        // check if the message was alraedy reported
        const { allMessages } = this.state;
        const message = allMessages.filter((mess) => {
            return mess._id === parseInt(messId, 10);
        });
        if (message[0].isReported) {
            this.setState({
                reportedMessageId: messId,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Already reported',
                    message: 'You already reported this message',
                    errors: {},
                },
            });
        } else {
            this.setState({
                reportedMessageId: messId,
                notification: {
                    status: 'confirm',
                    title: 'Confirmation required',
                    message: 'Please confirm reporting this message',
                    errors: {},
                },
            });
        }
    }

    handleUserBlockNotification = (event) => {
        const messId = event.target.id.replace('choices_block_', '');
        // check if the message was alraedy reported
        const { allMessages } = this.state;
        const message = allMessages.filter((mess) => {
            return mess._id === parseInt(messId, 10);
        });
        const senderId = message[0].sender.id;
        const { userProfile } = this.props;
        const isAlreadyBlocked = userProfile.blockedUsers.filter((sender) => {
            return sender.blocked.id === senderId;
        });
        if (isAlreadyBlocked.length > 0) {
            this.setState({
                blockedUserId: senderId,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Already blocked',
                    message: 'You already blocked this user',
                    errors: {},
                },
            });
        } else if (message[0].sender.username.includes('admin')) {
            this.setState({
                blockedUserId: senderId,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Not allowed',
                    message: 'You cannot block admin',
                    errors: {},
                },
            });
        } else {
            this.setState({
                blockedUserId: senderId,
                notification: {
                    status: 'confirm',
                    title: 'Confirmation required',
                    message: 'You cannot send or receive messages form blocked users',
                    errors: {},
                },
            });
        }
    }

    handleNotificationDismiss = () => {
        const { reportedMessageId, blockedUserId } = this.state;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (reportedMessageId || blockedUserId) {
            if (reportedMessageId && event.target.id === 'confirmed') {
                this.handleMessageStatusUpdate();
            } else if (blockedUserId && event.target.id === 'confirmed') {
                this.props.actionPostBlockUser(blockedUserId);
            } else {
                this.setState({
                    reportedMessageId: null,
                    blockedUserId: null,
                });
            }
        } else if (!reportedMessageId && !blockedUserId) {
            this.setState({
                isActiveNewMessage: false,
                messageContent: null,
                allMessages: [],
            });
            this.props.router.push('/mailbox/inbox/0');
        }
    };

    render() {
        const {
            routeParams,
            isActiveNewMessage,
            isLoadingLocal,
            messageContent,
            allMessages,
            userProfile,
            mailbox,
        } = this.state;
        const {
            isLoading,
            isLoadingAuth,
            isLoadingBlockUser,
        } = this.props;
        return (
            <>
                <main>
                    {!userProfile || !mailbox ? <Loading /> :
                        (
                            <>
                                {
                                    isLoading ||
                                    isLoadingAuth ||
                                    isLoadingLocal ||
                                    isLoadingBlockUser ?
                                        <Loading /> : null
                                }
                                <div id="mailbox_choices">
                                    <MailboxChoices
                                        routeParams={routeParams}
                                    />
                                </div>
                                <div id="mailbox_main">
                                    {isActiveNewMessage ?
                                        (
                                            <MessageForm
                                                userProfile={userProfile}
                                                routeParams={routeParams}
                                                location={location}
                                                mailbox={mailbox}
                                            />
                                        )
                                        :
                                        null}
                                    {messageContent ?
                                        (
                                            <MessageDetails
                                                userProfile={userProfile}
                                                routeParams={routeParams}
                                                messageContent={messageContent}
                                                handleMessageStatusUpdate={
                                                    this.handleMessageStatusUpdate
                                                }
                                                location={location}
                                                handleMessageReportNotification={
                                                    this.handleMessageReportNotification
                                                }
                                                handleUserBlockNotification={
                                                    this.handleUserBlockNotification
                                                }
                                            />
                                        )
                                        :
                                        null}
                                    {!messageContent && !isActiveNewMessage ?
                                        (
                                            <Inoutbox
                                                allMessages={allMessages}
                                                messagesType={routeParams.type}
                                                handleMessageStatusUpdate={
                                                    this.handleMessageStatusUpdate
                                                }
                                            />
                                        )
                                        : null}
                                </div>
                            </>
                        )}
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                    />
                </main>
            </>
        );
    }
}

MailboxHome.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    type: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingBlockUser: PropTypes.bool.isRequired,
    isLoadingAuth: PropTypes.bool.isRequired,
    userProfile: PropTypes.object,
    dataMailbox: PropTypes.any,
    dataStatusMessage: PropTypes.any,
    dataBlockUser: PropTypes.any,
    errorBlockUser: PropTypes.any,
    actionGetUserProfile: PropTypes.func.isRequired,
    actionGetMailbox: PropTypes.func.isRequired,
    actionPutMessageUpdateStatus: PropTypes.func.isRequired,
    actionPostBlockUser: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.mailbox,
        isLoadingAuth: state.auth.isLoading,
        userProfile: state.auth.userProfile,
        isLoadingBlockUser: state.account.isLoading,
        dataBlockUser: state.account.dataBlockUser,
        errorBlockUser: state.account.errorBlockUser,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetMailbox,
            actionGetUserProfile,
            actionPutMessageUpdateStatus,
            actionPostBlockUser,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(MailboxHome)));

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    let categories = await getCategories();
    categories = categories.data.categories;
    handlePrivateRoute(context);
    return {
        props: {
            categories,
        },
    };
}