/* eslint-disable no-param-reassign */
import React from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from '../styles/mailbox.module.scss';
import Link from './link';

class MailboxChoices extends React.Component {
    render() {
        const { routeParams } = this.props;
        return (
            <div className={styles.mbChoices}>
                <Link 
                    href="/mailbox/[type]/[messageId]"
                    as="/mailbox/inbox/0"
                    id="choices_inbox"
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        className={`choices ${
                            routeParams.type === 'inbox' ? styles.isActive : false
                        }`}
                        disabled={
                            routeParams.type === 'inbox' &&
                            parseInt(routeParams.messageId, 10) === 0
                        }
                    >
                        Inbox
                    </Button>
                </Link>
                <Link 
                    href="/mailbox/[type]/[messageId]"
                    as="/mailbox/outbox/0"
                    id="choices_outbox"
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        className={`choices ${
                            routeParams.type === 'outbox' ? styles.isActive : false
                        }`}
                        disabled={
                            routeParams.type === 'outbox' &&
                            parseInt(routeParams.messageId, 10) === 0
                        }
                    >
                        Outbox
                    </Button>
                </Link>
                <Link
                    href="/mailbox/[type]/[messageId]"
                    as="/mailbox/new-message/0"
                    id="choices_new-message"
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        className={`choices ${
                            routeParams.type === 'new-message'
                                ? styles.isActive
                                : false
                        }`}
                        disabled={routeParams.type === 'new-message'}
                    >
                        New
                    </Button>
                </Link>
            </div>
        );
    }
}

MailboxChoices.propTypes = {
    routeParams: PropTypes.object.isRequired,
};

export default MailboxChoices;
