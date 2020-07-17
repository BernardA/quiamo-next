import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {
    Button,
    MenuItem,
    FormGroup,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import NotifierDialog from './notifierDialog';
import {
    required,
    minLengthWithoutHTML,
    maxLength,
    minValue,
    isNumber,
} from '../tools/validator';
import {
    UPLOAD_MAX_SIZE,
    MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES,
    MAX_ATTACHMENTS_ALLOWED,
    ROOT_CATEGORIES,
} from '../parameters';
import { renderInput } from './formInputs';
import RenderSelect from './formInputRenderSelect';
import {
    actionPostMessageForBid,
    actionPostAttachments,
    actionPostBid,
    actionGetUserProfile,
} from '../store/actions';
import { Loading } from './loading';
import styles from '../styles/mailbox.module.scss';

const minLengthWithoutHTML10 = minLengthWithoutHTML(10);
const minValue0 = minValue(0);
const maxLength2000 = maxLength(2000);

const TextEditor = dynamic(() => import('./textEditor'), {
    ssr: false,
    loading: Loading,
});

class BidInsertForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadErrors: [],
            selectedFile: [],
            formValues: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const {
            dataAttachments,
            dataMessageForBid,
            dataPostBid,
            errorMessageForBid,
            errorPostBid,
            userProfile,
        } = this.props;
        if (!prevProps.dataAttachments && dataAttachments) {
            // post attachment success -> post message
            const attachments = [];
            dataAttachments.forEach((attach) => {
                attachments.push(attach['@id']);
            });
            const formValues = this.state.formValues;
            formValues.attachments = attachments;
            this.props.actionPostMessageForBid(formValues);
        }
        if (!prevProps.dataMessageForBid && dataMessageForBid) {
            const { formValues } = this.state;
            formValues.messageId = this.props.dataMessageForBid.message.id;
            this.props.actionPostBid(formValues);
        }
        if (!prevProps.errorMessageForBid && errorMessageForBid) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please review the following: ',
                    errors: this.props.errorMessageForBid,
                },
            });
        }
        if (!prevProps.dataPostBid && dataPostBid) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success',
                    message: 'Bid sent',
                    errors: {},
                },
            });
            // update user profile in store
            this.props.actionGetUserProfile(userProfile._id);
        }
        if (!prevProps.errorPostBid && errorPostBid) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please review the following: ',
                    errors: this.props.errorPostBid,
                },
            });
        }
    }

    handleSubmitBidInsert = () => {
        const { bidForm, ad } = this.props;
        const formVals = bidForm.values;

        const formValues = {};
        formValues.message = formVals.message;
        formValues.bid = formVals.bid || 0;
        formValues.ad = ad.id;
        formValues.parent = null;
        formValues.attachments = [];
        formValues.receiver = ad.user.id;
        formValues.subject = ad.description;

        if (this.state.selectedFile.length === 0) {
            this.props.actionPostMessageForBid(formValues);
            this.setState({ formValues });
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
        const { selectedFile } = this.state.selectedFile;
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
        this.setState({
            // activeNewMessage: false,
            // activeReply: false,
            selectedFile: [],
        });
        for (let i = 1; i < 4; i++) {
            document.getElementById(`file${i}`).innerHTML = '';
            document.getElementById(`file${i}`).parentElement.style.display = 'none';
        }
        this.props.reset();
    };

    handleNotificationDismiss = () => {
        const { notification: { status, title, errors } } = this.state;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (status !== 'error') {
            this.handleDiscardDraft();
        }
        if (
            title === 'Success' ||
            errors[0].bidder === 'You have already bid for this ad'
        ) {
            // TODO fix state does not work with next
            this.props.router.push('/search');
        }
    }

    render() {
        const main = ROOT_CATEGORIES.split(',');
        const budgetTypes = [
            { value: '', label: 'Select' },
            { value: 'hour', label: 'per hour' },
            { value: 'day', label: 'per day' },
            { value: 'global', label: 'global' },
            { value: 'quote', label: 'quote' },
            { value: 'free', label: 'free' },
        ];
        const {
            handleSubmit,
            submitting,
            invalid,
            error,
            pristine,
            ad,
            isLoading,
            isLoadingMailbox,
            bidType,
        } = this.props;
        if (error) {
            return <div>{error.messageKey}</div>;
        }
        return (
            <>
                {isLoading || isLoadingMailbox ? <Loading /> : null}
                <form
                    name="bid_insert_form"
                    onSubmit={handleSubmit(this.handleSubmitBidInsert)}
                >
                    {ad.category.root.title === main[1] ? (
                        <div className="form_input form_select">
                            <Field
                                name="bidType"
                                type="select"
                                id="bidType"
                                validate={[required]}
                                component={RenderSelect}
                                variant="outlined"
                                label="Bid type"
                            >
                                {budgetTypes.map((option) => {
                                    return (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    );
                                })}
                            </Field>
                        </div>
                    ) : null}
                    {bidType !== 'free' ?
                        (
                            <div className="form_input">
                                <Field
                                    name="bid"
                                    type="number"
                                    id="bid"
                                    label="Bid"
                                    autofocus
                                    component={renderInput}
                                    validate={[isNumber, minValue0, required]}
                                    variant="outlined"
                                />
                            </div>
                        ) : null}
                    {typeof window !== 'undefined' ?
                        (
                            <div className="form_input">
                                <Field
                                    name="message"
                                    id="message"
                                    label="Message"
                                    placeholder="Write your message"
                                    component={TextEditor}
                                    validate={[
                                        required,
                                        minLengthWithoutHTML10,
                                        maxLength2000,
                                    ]}
                                    variant="outlined"
                                />
                            </div>
                        )
                        : null}
                    <div className="form_input">
                        <label
                            htmlFor="imgFile"
                            id="imgFile_label"
                            className={styles.imgFileLabel}
                        >
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
                                <TableCell
                                    id="file1"
                                    className={styles.excerpt}
                                />
                                <TableCell
                                    id="trash1"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon
                                        className={styles.noClick}
                                        title="delete file"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow id="attach2">
                                <TableCell
                                    id="file2"
                                    className={styles.noClick}
                                />
                                <TableCell
                                    id="trash2"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon
                                        className={styles.noClick}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow id="attach3">
                                <TableCell
                                    id="file3"
                                    className={styles.excerpt}
                                />
                                <TableCell
                                    id="trash3"
                                    className="icon_container"
                                    onClick={this.handleDeleteFileSelected}
                                >
                                    <DeleteOutlinedIcon
                                        className={styles.noClick}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="form_input form_submit">
                        <FormGroup row>
                            <Button
                                variant="outlined"
                                color="primary"
                                name="_submit"
                                type="submit"
                                disabled={submitting || invalid}
                            >
                                Submit
                            </Button>
                            <Button
                                disabled={pristine || submitting}
                                onClick={this.handleDiscardDraft}
                                variant="outlined"
                                color="primary"
                            >
                                Clear
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

BidInsertForm.propTypes = {
    error: PropTypes.any,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    dataAttachments: PropTypes.any,
    dataMessageForBid: PropTypes.any,
    dataPostBid: PropTypes.any,
    errorMessageForBid: PropTypes.any,
    errorPostBid: PropTypes.any,
    actionPostAttachments: PropTypes.func.isRequired,
    actionPostMessageForBid: PropTypes.func.isRequired,
    actionPostBid: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    userProfile: PropTypes.object.isRequired,
    ad: PropTypes.object.isRequired,
    bidForm: PropTypes.any,
    router: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingMailbox: PropTypes.bool.isRequired,
    bidType: PropTypes.string,
};

/*
const mapStateToProps = (state) => {
    const { bidType } = selector(state, 'bidType');
    return {
        ...state.bid,
        bidForm: state.form.BidInsertForm,
        dataAttachments: state.mailbox.dataAttachments,
        dataMessageForBid: state.mailbox.dataMessageForBid,
        errorMessageForBid: state.mailbox.errorMessageForBid,
        isLoadingMailbox: state.mailbox.isLoading,
        bidType,
    };
};
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostMessageForBid,
            actionPostAttachments,
            actionPostBid,
            actionGetUserProfile,
        },
        dispatch,
    );
}
*/
const selector = formValueSelector('BidInsertForm');

export default connect(
    (state) => {
        return {
            ...state.bid,
            bidForm: state.form.BidInsertForm,
            dataAttachments: state.mailbox.dataAttachments,
            isLoadingMailbox: state.mailbox.isLoading,
            bidType: selector(state, 'bidType'),
        };
    },
    (dispatch) => {
        return bindActionCreators(
            {
                actionPostMessageForBid,
                actionPostAttachments,
                actionPostBid,
                actionGetUserProfile,
            },
            dispatch,
        );
    },
)(reduxForm({
    form: 'BidInsertForm',
})(BidInsertForm));
