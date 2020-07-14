import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactHtmlParser from 'react-html-parser';
import {
    createMuiTheme,
    MuiThemeProvider,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import NotifierInline from './notifierInline';
import {
    LOCALE,
    CURRENCY,
} from '../parameters';
import styles from '../styles/myAds.module.scss';
import { showtime } from '../tools/functions';

const getMuiTheme = () => createMuiTheme({
    overrides: {
        MuiAccordionSummary: {
            content: {
                width: '80%',
            },
        },
        MuiCollapse: {
            wrapper: {
                borderTop: '1px solid #ccc',
            },
        },
    },
});

class MyAdsBidList extends React.Component {
    render() {
        const budgetBid = (bid) => {
            if (bid.bidType === 'free') {
                return `Bid: ${bid.bidType}`;
            }
            const bidCurr = new Intl.NumberFormat(LOCALE, {
                style: 'currency',
                currency: CURRENCY,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(bid.bid);
            return `Bid: ${bidCurr}${bid.bidType ? `/${bid.bidType}` : ''}`;
        };
        const { cookies, isMyAds, router } = this.props;
        let bids = this.props.bids;
        if (!isMyAds) {
            bids = bids.filter((bid) => {
                return bid.bidder._id === parseInt(cookies.get('userId'), 10);
            });
        }
        if (bids.length !== 0) {
            return (
                <div>
                    {bids.map((bid) => {
                        return (
                            <MuiThemeProvider key={bid.id} theme={getMuiTheme()}>
                                <Accordion className={styles.root}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${bid.id}-content`}
                                        id={`panel${bid.id}-header`}
                                        className={styles.bidHeader}
                                    >
                                        <div className={styles.bidSummary}>
                                            <Typography>
                                                {`Bidder: ${bid.bidder.username}`}
                                            </Typography>
                                            <Typography>
                                                {budgetBid(bid)}
                                            </Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            <ListItem>
                                                <ListItemText
                                                    className={styles.subject}
                                                    primary={showtime(bid.message[0].sentAt)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    className={styles.subject}
                                                    primary={bid.message[0].subject}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primary={ReactHtmlParser(
                                                    bid.message[0].message,
                                                )}
                                                />
                                            </ListItem>
                                            {isMyAds ?
                                                (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        onClick={() => router.push(
                                                            '/mailbox/[type]/[messageId]',
                                                            `/mailbox/inbox/${bid.message[0]._id}`,
                                                        )}
                                                    >
                                                        Reply
                                                    </Button>
                                                ) : null}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </MuiThemeProvider>
                        );
                    })}
                </div>
            );
        }
        return <NotifierInline message="No active bids" isNotClosable />;
    }
}

MyAdsBidList.propTypes = {
    isMyAds: PropTypes.bool.isRequired,
    bids: PropTypes.array.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    router: PropTypes.object.isRequired,
};

export default withCookies(MyAdsBidList);
