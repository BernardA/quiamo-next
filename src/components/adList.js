import React from 'react';
import PropTypes from 'prop-types';
import AdCard from './adCard';
import NotifierInline from './notifierInline';
import styles from '../styles/search.module.scss';
import { 
    USER_IMAGE_DIRECTORY,
    AVATAR_PLACEHOLDER_PATH,
} from '../parameters';

const AdList = (props) => {
    const { currentAds } = props;
    const adList = () => {
        const tags = currentAds.map((ad) => {
            // if user has no img on profile, get placeholder img
            let imgPath = `${process.env.NEXT_PUBLIC_API_HOST}${AVATAR_PLACEHOLDER_PATH}`;
            if (ad.node.user.image) {
                imgPath = `${process.env.NEXT_PUBLIC_API_HOST}${USER_IMAGE_DIRECTORY}${ad.node.user.image.filename}`;
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
