import React from 'react';
import { Typography, Breadcrumbs } from '@material-ui/core';
import PropTypes from 'prop-types';
import Link from '../components/link';

export default function Breadcrumb(props) {
    const { links } = props;
    return (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
            {
                links.map((link) => {
                    if (link.href) {
                        return (
                            <Link key={link.href} color="inherit" href={link.href}>
                                {link.text}
                            </Link>
                        );
                    }
                    return (
                        <Typography key={link.text} color="textPrimary">
                            {link.text}
                        </Typography>
                    );
                })
            }
        </Breadcrumbs>
    );
}

Breadcrumb.propTypes = {
    links: PropTypes.array.isRequired,
};
