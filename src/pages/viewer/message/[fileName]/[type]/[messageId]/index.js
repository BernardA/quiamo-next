import React, { useState, useEffect } from 'react';
import Carousel from 'react-images';
import PDFViewer from 'pdf-viewer-reactjs';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
// import PropTypes from 'prop-types';
import {
    MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES,
    MESSAGE_ATTACHMENT_DIRECTORY,
} from '../../../../../../parameters';
import NotifierInline from '../../../../../../components/notifierInline';
import Breadcrumb from '../../../../../../components/breadcrumb';
import styles from '../../../../../../styles/mailbox.module.scss';
import { Loading } from '../../../../../../components/loading';
import Link from '../../../../../../components/link';
import getCategories from '../../../../../../lib/getCategories';
import { handlePrivateRoute } from '../../../../../../tools/functions';

const Viewer = () => {
    const router = useRouter();
    const { query: { fileName, type, messageId } } = router;
    console.log('router', router);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const fileType = fileName.split('.').pop();
        const isAccepted = MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES.filter(
            (ftype) => {
                return ftype.includes(fileType);
            },
        );
        if (isAccepted.length === 0) {
            setMessage('The file type is invalid.');
        }
    });
    const source = `${process.env.NEXT_PUBLIC_API_HOST}${MESSAGE_ATTACHMENT_DIRECTORY}${fileName}`;
    const images = [{ source }];
    const customCarouselStyles = {
        view: (base) => ({
            ...base,
            maxWidth: 500,
            margin: '0 auto',
        }),
    };

    return (
        <main>
            <Breadcrumb
                links={[
                    { 
                        href: '/mailbox/[type]/[messageId]',
                        as: '/mailbox/inbox/0', 
                        text: 'mailbox' },
                    {
                        href: '/mailbox/[type]/[messageId]',
                        as: `/mailbox/${type}/0`,
                        text: type,
                    },
                    {
                        href: '/mailbox/[type]/[messageId]',
                        as: `/mailbox/${type}/${messageId}`,
                        text: 'message',
                    },
                ]}
            />
            <div className={styles.viewer}>
                <Link
                    className={styles.link}
                    href='/mailbox/[type]/[messageId]'
                    as={`/mailbox/${type}/${messageId}`}
                    
                    aria-label="back to message"
                >
                    <Button
                        className={styles.buttonViewer}
                        variant="contained"
                        color="primary"
                        aria-label="back to message"
                    >
                        Back to message
                    </Button>
                </Link>
            </div>
            {!fileName.includes('pdf') ? (
                <Carousel
                    views={images}
                    styles={customCarouselStyles}
                    // frameProps={{ autoSize: 'height' }}
                    components={{ Footer: null }}
                    // styles={{isFullScreen: false}}
                />
            ) : (
                <PDFViewer
                    document={{
                        url: source,
                    }}
                    navbarOnTop
                    loader={<Loading />}
                    canvasCss={styles.pdfCanvas}
                />
            )}
            {message ? (
                <NotifierInline
                    severity="danger"
                    isNotClosable
                    message={message}
                />
            ) : null}
        </main>
    );
};

// Viewer.propTypes = {
// };

export default Viewer;

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
