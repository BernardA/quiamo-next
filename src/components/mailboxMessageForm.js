/* eslint-disable react/no-access-state-in-setstate */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { required, minLengthWithoutHTML, maxLength } from '../tools/validator';
import { renderInput } from './formInputs';
import RenderSelect from './formInputRenderSelect';
import NotifierDialog from './notifierDialog';
import {
    UPLOAD_MAX_SIZE,
    MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES,
    MAX_ATTACHMENTS_ALLOWED,
} from '../parameters';
import {
    actionPostMessage,
    actionPostAttachments,
    actionGetMailbox,
} from '../store/actions';
import { Loading } from './loading';
import styles from '../styles/mailbox.module.scss';

const minLengthWithoutHTML10 = minLengthWithoutHTML(10);
const maxLength150 = maxLength(150);
const maxLength2000 = maxLength(2000);

const TextEditor = dynamic(() => import('./textEditor'), {
    ssr: false,
    loading: Loading,
});


class MessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadErrors: [],
            selectedFile: [],
            formValues: null,
            contacts: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        if (!this.props.isActiveReply) {
            this.setContacts();
        }
    }

    componentDidUpdate(prevProps) {
        const { dataAttachments, dataMessage, userProfile, router } = this.props;
        if ((!prevProps.dataAttachments && dataAttachments) ||
            prevProps.dataAttachments !== dataAttachments) {
            // post attachment success -> post message
            const attachments = [];
            dataAttachments.forEach((attach) => {
                attachments.push(attach['@id']);
            });
            const formValues = this.state.formValues;
            formValues.attachments = attachments;
            this.props.actionPostMessage(formValues);
        }

        if ((!prevProps.dataMessage && dataMessage) ||
            prevProps.dataMessage !== dataMessage) {
            // post message success -> update mailbox
            this.props.actionGetMailbox(userProfile._id);
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Your message was sent',
                    message: 'You will be redirected to inbox ',
                    errors: {},
                },
            });
            setTimeout(() => router.push('/mailbox/[type]/[messageId]', '/mailbox/inbox/0'), 3000);
        }

        if (!prevProps.errorPostMessage && this.props.errorPostMessage) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please review the following: ',
                    errors: this.props.errorPostMessage,
                },
            });
        }
    }

    setContacts = () => {
        const { userProfile } = this.props;
        const userId = userProfile.id;
        const { inbox, outbox } = this.props.mailbox;
        const contacts = [];
        const ids = [];
        inbox.forEach((message) => {
            const blocked = userProfile.blockedUsers.filter((sender) => {
                return sender.blocked.id === message.sender.id;
            });
            if (blocked.length === 0 &&
                message.sender.id !== userId &&
                ids.indexOf(message.sender.id) === -1) {
                contacts.push({
                    id: message.sender.id,
                    username: message.sender.username,
                });
            }
            ids.push(message.sender.id);
        });
        outbox.forEach((message) => {
            const blockedBy = userProfile.blockedByUsers.filter((receiver) => {
                return receiver.blocker.id === message.receiver.id;
            });
            if (blockedBy.length === 0 &&
                message.receiver.id !== userId &&
                ids.indexOf(message.receiver.id) === -1) {
                contacts.push({
                    id: message.receiver.id,
                    username: message.receiver.username,
                });
            }
            ids.push(message.receiver.id);
        });
        this.setState({ contacts });
    }

    handleMessageFormSubmit = () => {
        const { routeParams, messageForm } = this.props;
        const formVals = messageForm.values;
        // if it is not a new message, ie, it is a reply
        let original = null;
        const formValues = {};
        const { type } = routeParams;
        formValues.message = formVals.message.message;
        formValues.parent = null;
        formValues.attachments = [];
        formValues.ad = null;
        // if a reply
        if (type !== 'new-message') {
            original = this.props.originalMessage;
            formValues.subject = original.subject;
            formValues.receiver = original.sender.id;
            if (original.parent) {
                formValues.parent = original.parent.id;
            } else {
                formValues.parent = original.id;
            }
        }
        // if a new message unrelated to ad
        if (formVals.message.receiver) {
            formValues.receiver = formVals.message.receiver;
            formValues.subject = formVals.message.subject;
        }
        if (this.state.selectedFile.length === 0) {
            this.props.actionPostMessage(formValues);
        } else {
            this.handleAttachmentsSubmit();
            this.setState({ formValues });
        }
    };

    handleAttachmentsSubmit = () => {
        const attachments = new FormData();
        const filesLength = this.state.selectedFile.length;
        for (let i = 0; i < filesLength; i++) {
            attachments.append('file[]', this.state.selectedFile[i]);
        }
        this.props.actionPostAttachments(attachments);
    }

    handleFileSelected = (event) => {
        this.setState({ uploadErrors: [] });
        const file = event.target.files[0];
        const errors = [];
        // check if file with same name already exists
        const sameName = this.state.selectedFile.filter((selected) => {
            return file.name === selected.name || false;
        });
        if (sameName.length > 0) {
            errors.push('A file with that name is already selected.');
        }
        if (!MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES.includes(file.type)) {
            errors.push('Invalid file type. Accepted: jpeg, png, pdf.');
        }
        if (file.size > UPLOAD_MAX_SIZE) {
            errors.push('File size is bigger than allowed( 2MB )');
        }

        this.setState({ uploadErrors: errors });
        if (errors.length === 0) {
            const updateSelectedFile = new Promise((resolve) => {
                resolve(
                    this.setState((prevState) => ({
                        selectedFile: [...prevState.selectedFile, file],
                    })),
                );
            });
            updateSelectedFile.then(() => {
                if (this.state.selectedFile.length === MAX_ATTACHMENTS_ALLOWED) {
                    const fileButton = document.getElementById('attach_button');
                    const fileInput = document.getElementById('imgFile_label');
                    fileButton.disabled = true;
                    fileInput.disabeld = true;
                    fileInput.classList.add('disabled');
                    fileButton.classList.add('disabled');
                }
                for (let i = 1; i < 4; i++) {
                    const td = document.getElementById(`file${i}`);
                    if (td.innerHTML === '') {
                        const name = document.createTextNode(file.name);
                        td.appendChild(name);
                        td.parentElement.style.display = 'table-row';
                        return;
                    }
                }
            });
            document.getElementById('imgFile').value = '';
        }
    };

    handleDeleteFileSelected = (event) => {
        const index = parseInt(event.target.id.replace(/[^0-9.]/g, ''), 10);
        const filename = document.getElementById(`file${index}`).innerHTML;
        document.getElementById(`file${index}`).innerHTML = '';
        document.getElementById(`file${index}`).parentElement.style.display = 'none';
        const selectedFile = this.state.selectedFile;
        let count = 0;
        selectedFile.forEach((file) => {
            if (file.name === filename) {
                selectedFile.splice(count, 1);
            }
            count++;
        });
        this.setState({ selectedFile });
        const fileButton = document.getElementById('attach_button');
        const fileInput = document.getElementById('imgFile_label');
        fileButton.disabled = false;
        fileInput.disabeld = false;
        fileInput.classList.remove('disabled');
        fileButton.classList.remove('disabled');
    };

    handleDiscardDraft = () => {
        const { reset, router } = this.props;
        this.setState({
            // activeNewMessage: false,
            // activeReply: false,
            selectedFile: [],
        });
        for (let i = 1; i < 4; i++) {
            document.getElementById(`file${i}`).innerHTML = '';
            document.getElementById(`file${i}`).parentElement.style.display = 'none';
        }
        reset();
        router.push('/mailbox/[type]/[messageId]', '/mailbox/inbox/0');
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
            handleSubmit,
            submitting,
            invalid,
            error,
            pristine,
            reset,
            routeParams,
        } = this.props;

        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <>
                <form
                    name="message"
                    id="message_form"
                    onSubmit={handleSubmit(this.handleMessageFormSubmit)}
                >
                    {
                        this.state.contacts && routeParams.type === 'new-message' ?
                            (
                                <div className="form_input">
                                    <Field
                                        name="message[receiver]"
                                        type="select"
                                        id="receiver"
                                        component={RenderSelect}
                                        validate={[required]}
                                        autoFocus
                                        variant="outlined"
                                        placeholder="Receiver"
                                    >
                                        <MenuItem value=""> Select recipient </MenuItem>
                                        {this.state.contacts.map((contact) => {
                                            return (
                                                <MenuItem
                                                    key={contact.id}
                                                    value={contact.id}
                                                >
                                                    {contact.username}
                                                </MenuItem>
                                            );
                                        })}
                                    </Field>
                                </div>
                            )
                            :
                            null
                    }
                    {
                        routeParams.type === 'new-message' ?
                            (
                                <div className="form_input">
                                    <Field
                                        name="message[subject]"
                                        type="text"
                                        id="subject"
                                        label="Subject"
                                        variant="outlined"
                                        placeholder="Subject"
                                        component={renderInput}
                                        validate={[required, maxLength150]}
                                    />
                                </div>
                            )
                            : null
                    }
                    {typeof window !== 'undefined' ?
                        (
                            <div className="form_input">
                                <Field
                                    name="message[message]"
                                    id="message"
                                    label="Message"
                                    variant="outlined"
                                    placeholder="Write your message"
                                    component={TextEditor}
                                    validate={[required, minLengthWithoutHTML10, maxLength2000]}
                                />
                            </div>
                        )
                        : null}
                    <div className="form_input">
                        <label htmlFor="imgFile" id="imgFile_label" className={styles.imgFileLabel}>
                            <Button
                                id="attach_button"
                                variant="outlined"
                                className={styles.noClick}
                                color="primary"
                            >
                                <AttachFileOutlinedIcon />
                                {`max ${MAX_ATTACHMENTS_ALLOWED}`}
                            </Button>
                        </label>
                        <input
                            name="message[attachments]"
                            type="file"
                            id="imgFile"
                            className={styles.fileInput}
                            onChange={this.handleFileSelected}
                            multiple
                        />
                    </div>
                    <div className="form_input">
                        <ul>
                            {this.state.uploadErrors.map((err) => {
                                return (
                                    <li key={err}>
                                        <span className="form_error">
                                            {err}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <Table className={styles.attachDialog}>
                        <TableBody>
                            <TableRow id="attach1">
                                <TableCell id="file1" className={styles.excerpt} />
                                <TableCell
                                    id="trash1"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon className={styles.noClick} title="delete file" />
                                </TableCell>
                            </TableRow>
                            <TableRow id="attach2">
                                <TableCell id="file2" className={styles.noClick} />
                                <TableCell
                                    id="trash2"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon className={styles.noClick} />
                                </TableCell>
                            </TableRow>
                            <TableRow id="attach3">
                                <TableCell id="file3" className={styles.excerpt} />
                                <TableCell
                                    id="trash3"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon className={styles.noClick} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className={`form_input ${styles.formInput}`}>
                        <FormGroup row className={`form_group ${styles.mbChoices2}`}>
                            <Button
                                variant="contained"
                                color="primary"
                                name="_submit"
                                id="submit_message"
                                type="submit"
                                disabled={submitting || invalid}
                            >
                                Send
                            </Button>
                            <Button
                                disabled={pristine || submitting}
                                onClick={reset}
                                variant="contained"
                                color="primary"
                            >
                                Clear
                            </Button>
                            <Button
                                id="discard_draft"
                                onClick={this.handleDiscardDraft}
                                variant="contained"
                                color="primary"
                            >
                                Discard
                            </Button>
                        </FormGroup>
                    </div>
                </form>
                <NotifierDialog
                    notification={this.state.notification}
                    handleNotificationDismiss={this.handleNotificationDismiss}
                />
            </>
        );
    }
}

MessageForm.propTypes = {
    error: PropTypes.object,
    errorPostMessage: PropTypes.any,
    userProfile: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    routeParams: PropTypes.object.isRequired,
    messageForm: PropTypes.any,
    isActiveReply: PropTypes.bool,
    originalMessage: PropTypes.object,
    actionPostMessage: PropTypes.func.isRequired,
    actionPostAttachments: PropTypes.func.isRequired,
    actionGetMailbox: PropTypes.func.isRequired,
    dataAttachments: PropTypes.any,
    dataMessage: PropTypes.any,
    mailbox: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.mailbox,
        messageForm: state.form.MessageForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostMessage,
            actionPostAttachments,
            actionGetMailbox,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(reduxForm({
    form: 'MessageForm',
})(MessageForm));
