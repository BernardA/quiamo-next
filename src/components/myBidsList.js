import React from 'react';
import MUIDataTable from 'mui-datatables';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import
{
    CheckBox,
    Cancel,
    Visibility,
} from '@material-ui/icons';
import {
    createMuiTheme,
    MuiThemeProvider,
    withStyles,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { stripHtmlToText, dateFormat } from '../tools/functions';
import NotifierInline from './notifierInline';

const styles = {
    isActive: {
        color: 'green',
    },
    isNotActive: {
        color: 'red',
    },
    clickable: {
        cursor: 'pointer',
        '& path': {
            pointerEvents: 'none',
        },
    },
};

const getMuiTheme = () => createMuiTheme({
    overrides: {
        MUIDataTableHeadCell: {
            root: {
                '&:nth-child(1)': {
                    width: '100px',
                },
                '&:nth-child(2)': {
                    width: '150px',
                },
                '&:nth-child(3)': {
                    width: '200px',
                },
                '&:nth-child(4)': {
                    width: '80px',
                },
                '&:nth-child(5)': {
                    width: '80px',
                },
                '&:nth-child(6)': {
                    width: '80px',
                },
                '&:nth-child(7)': {
                    width: '80px',
                },
            },
        },
        MUIDataTableBodyCell: {
            root: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            cellStackedSmall: {
                height: '48px',
            },
            responsiveStackedSmall: {
                height: '48px',
            },
            stackedCommon: {
                height: '48px',
                width: '50%',
            },
        },
        MUIDataTableBodyRow: {
            root: {
                borderBottom: 'solid 2px #2d5074',
            },
            responsiveStacked: {
                borderBottom: 'solid 2px #2d5074',
            },
        },
    },
});

const BidList = (props) => {
    const { bids, classes, handleDeleteBid, router } = props;
    const data = [];
    if (bids && bids.length !== 0) {
        bids.forEach((row) => {
            data.push({
                id: row._id,
                createdAt: row.message[0].sentAt,
                category: row.ad.category.title,
                description: stripHtmlToText(row.ad.description),
                bid: row.bid,
                isActive: !!row.ad.isDeleted || row.ad.isActive,
                viewBid: row.ad._id,
            });
        });
    }
    const columns = [
        {
            name: 'id',
            options: {
                display: false,
            },
        },
        {
            name: 'createdAt',
            label: 'Created at',
            options: {
                customBodyRender: (value) => {
                    return dateFormat(value);
                },
            },
        },
        {
            name: 'category',
            label: 'Category',
        },
        {
            name: 'description',
            label: 'Description',
        },
        {
            name: 'bid',
            label: 'bid $',
        },
        {
            name: 'isActive',
            label: 'is ad active',
            options: {
                customBodyRender: (value) => {
                    return value ?
                        <CheckBox className={classes.isActive} />
                        : <Cancel className={classes.isNotActive} />;
                },
            },
        },
        {
            name: 'viewBid',
            label: ' View bid',
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Visibility
                            id={tableMeta.rowData[0]}
                            className={classes.clickable}
                            onClick={() => router.push(
                                '/my-bids/view/[adId]',
                                `/my-bids/view/${value}`)}
                        />
                    );
                },
            },
        },
        {
            name: 'deleteBid',
            label: 'Delete bid',
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <DeleteOutlinedIcon
                            id={tableMeta.rowData[0]}
                            className={classes.clickable}
                            onClick={handleDeleteBid}
                        />
                    );
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
        selectableRows: 'none',
        selectableRowsHeader: false,
        rowsPerPageOptions: [10],
    };
    if (bids.length !== 0) {
        return (
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    title="My bids"
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
    return <NotifierInline message="No active bids" isNotClosable />;
};

BidList.propTypes = {
    bids: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    handleDeleteBid: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
};

export default withStyles(styles)(BidList);