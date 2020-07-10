import React from 'react';
import { withRouter } from 'next/router';
import { AttachFileOutlined } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';
import classnames from 'classnames';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { showtime } from '../tools/functions';

const styles = {
    unreadMessage: {
        '& td': { fontWeight: '800' },
    },
};

class Inoutbox extends React.Component {
    render() {
        const getMuiTheme = () => createMuiTheme({
            overrides: {
                MUIDataTableHeadCell: {
                    root: {
                        '&:nth-child(1)': {
                            width: '100px',
                        },
                        '&:nth-child(2)': {
                            width: '250px',
                        },
                        '&:nth-child(3)': {
                            width: '110px',
                        },
                        '&:nth-child(4)': {
                            width: '80px',
                        },
                    },
                },
                MUIDataTableBodyCell: {
                    root: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                    },
                    cellStackedSmall: {
                        height: '48px',
                    },
                    responsiveStackedSmall: {
                        height: '48px',
                    },
                },
                MuiTypography: {
                    h6: {
                        textTransform: 'capitalize',
                        fontWeight: '700',
                        letterSpacing: '.1em',
                    },
                },
            },
        });

        const {
            allMessages,
            messagesType,
            classes,
            handleMessageStatusUpdate,
            router,
        } = this.props;
        const data = [];
        allMessages.forEach((message) => {
            let correspondent = null;
            if (messagesType === 'inbox') {
                correspondent = message.sender.username;
            } else {
                correspondent = message.receiver.username;
            }
            data.push({
                id: message._id,
                readAt: message.readAt,
                correspondent,
                subject: message.subject,
                sentAt: message.sentAt,
                attachments: message.attachments.length,
            });
        });
        let correspondentLabel = 'Sender';
        let sentAtLabel = 'Received at';
        if (messagesType === 'outbox') {
            correspondentLabel = 'Recipient';
            sentAtLabel = 'Sent at';
        }
        const columns = [
            {
                name: 'id',
                options: {
                    display: false,
                },
            },
            {
                name: 'readAt',
                options: {
                    display: false,
                },
            },
            {
                name: 'correspondent',
                label: correspondentLabel,
            },
            {
                name: 'subject',
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: 'sentAt',
                label: sentAtLabel,
                options: {
                    customBodyRender: (value) => {
                        return showtime(value);
                    },
                },
            },
            {
                name: 'attachments',
                options: {
                    filter: false,
                    sort: false,
                    // eslint-disable-next-line no-confusing-arrow
                    customBodyRender: (value) => {
                        return value > 0 ? <AttachFileOutlined /> : '';
                    },
                },
            },
        ];
        const options = {
            sort: false,
            viewColumns: false,
            filter: false,
            print: false,
            download: false,
            filterType: 'dropdown',
            responsive: 'stacked',
            rowsPerPageOptions: [10],
            selectableRows: 'none',
            selectableRowsHeader: false,
            onRowClick: (rowData) => {
                if (messagesType === 'inbox') {
                    handleMessageStatusUpdate(event, rowData[0]);
                }
                router.push(`/mailbox/${messagesType}/${rowData[0]}`);
            },
            setRowProps: (row) => {
                return {
                    className: classnames(
                        {
                            [classes.unreadMessage]: messagesType === 'inbox' && !row[1],
                        },
                    ),
                };
            },
        };

        return (
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    title={messagesType}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

Inoutbox.propTypes = {
    allMessages: PropTypes.array.isRequired,
    messagesType: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleMessageStatusUpdate: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Inoutbox));
