import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Create,
    HourglassEmptyOutlined,
    CompareArrowsOutlined,
    GavelOutlined,
    SearchRounded,
    MessageRounded,
    MoodRounded,
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { LANG } from '../parameters';

const trans = {
    br: {
        howItWorks: 'Como funciona',
        needSomething: 'Precisando de alguma coisa',
        waitContactFromNeighbors: 'Espero resposta dum vizinho',
        exchangeWithNeighbors: 'Troque uma ideia com os vizinhos',
        chooseBestOffer: 'Escolha a melhor oferta',
        enjoy: 'Aproveite',
        willingToHelp: 'Disposto a ajudar',
        searchAds: 'Procure um anuncio',
        makeYourOffer: 'Faca uma proposta',
        waitResponse: 'Espere um retorno',
        exchangeWithNeighbor: 'Negocie com o interessado',
        happyToHelp: 'Contente de ajudar!',
    },
    en: {
        howItWorks: 'How it works',
        needSomething: 'Need something',
        waitContactFromNeighbors: 'Wait contact from neighbors',
        exchangeWithNeighbors: 'Exchange with neighbors',
        chooseBestOffer: 'Choose the best offer',
        enjoy: 'Enjoy',
        willingToHelp: 'Willing to help',
        searchAds: 'Search ads',
        makeYourOffer: 'Make your offer',
        waitResponse: 'Wait response',
        exchangeWithNeighbor: 'Exchange with neighbor',
        happyToHelp: 'Happy to help!'
    }
}

const styles = () => ({
    root: {
        color: '#2d5074',
    },
    scroller: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 300px))',
        padding: '10px',
        justifyContent: 'space-evenly',
    },
    conceptImg: {
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        '& svg': {
            width: '40px',
            height: '40px',
            marginRight: '20px',
        },
        '& div': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
        },
        '& div:last-child': {
            marginBottom: '50px',
        },
    },
    header: {
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: '1.3rem',
        textAlign: 'center',
        paddingTop: '30px',
    },
    subHeader: {
        textTransform: 'uppercase',
        fontWeight: '700',
    },
});

const Concept = (props) => {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <div>
                <Typography className={classes.header}>
                    {trans[LANG].howItWorks}
                </Typography>
            </div>
            <div className={classes.scroller}>
                <div className={classes.conceptImg}>
                    <div>
                        <Typography className={classes.subHeader}>
                            {`${trans[LANG].needSomething}?`}
                        </Typography>
                    </div>
                    <div>
                        <Create />
                        <Typography>{trans[LANG].createYourAd}</Typography>
                    </div>
                    <div>
                        <HourglassEmptyOutlined />
                        <Typography>
                            {trans[LANG].waitContactFromNeighbors}
                        </Typography>
                    </div>
                    <div>
                        <CompareArrowsOutlined />
                        <Typography>
                            {trans[LANG].exchangeWithNeighbors}
                        </Typography>
                    </div>
                    <div>
                        <GavelOutlined />
                        <Typography>{trans[LANG].chooseBestOffer}</Typography>
                    </div>
                    <div>
                        <MoodRounded />
                        <Typography>{`${trans[LANG].enjoy}!`}</Typography>
                    </div>
                </div>
                <div className={classes.conceptImg}>
                    <div>
                        <Typography className={classes.subHeader}>
                            {`${trans[LANG].willingToHelp}?`}
                        </Typography>
                    </div>
                    <div>
                        <SearchRounded />
                        <Typography>{trans[LANG].searchAds}</Typography>
                    </div>
                    <div>
                        <MessageRounded />
                        <Typography>{trans[LANG].makeYourOffer}</Typography>
                    </div>
                    <div>
                        <HourglassEmptyOutlined />
                        <Typography>{trans[LANG].waitResponse}</Typography>
                    </div>
                    <div>
                        <CompareArrowsOutlined />
                        <Typography>
                            {trans[LANG].exchangeWithNeighbor}
                        </Typography>
                    </div>
                    <div>
                        <MoodRounded />
                        <Typography>{trans[LANG].happyToHelp}</Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

Concept.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Concept);
