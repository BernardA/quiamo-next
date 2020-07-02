import React from 'react';
import PropTypes from 'prop-types';
import AdCard from './adCard';
import NotifierInline from './notifierInline';
import { AVATAR_PLACEHOLDER_PATH, USER_IMAGE_DIRECTORY } from '../parameters';
import styles from '../styles/search.module.scss';

const AdList = (props) => {
    const { currentAds } = props;
    const adList = () => {
        const tags = currentAds.map((ad) => {
            // if user has no img on profile, get placeholder img
            let imgPath = `${process.env.API_HOST}${AVATAR_PLACEHOLDER_PATH}`;
            if (ad.node.user.image) {
                imgPath = `${process.env.API_HOST}${USER_IMAGE_DIRECTORY}${ad.node.user.image.filename}`;
            }
            return <AdCard key={ad.node.id} ad={ad.node} imgPath={imgPath} display="vertical" />;
        });
        return tags;
    };

    return (
        <div className={styles.adList}>
            {currentAds.length === 0 ? (
                <NotifierInline
                    message='No ads match your search'
                    isNotClosable
                />
            ) : (
                adList()
            )}
        </div>
    );
};

AdList.propTypes = {
    currentAds: PropTypes.any,
};

export default AdList;
