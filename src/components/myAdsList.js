import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import {
    CheckBox,
    Cancel,
    EditOutlined,
    GavelOutlined,
} from '@material-ui/icons';
import {
    createMuiTheme,
    MuiThemeProvider,
    withStyles,
} from '@material-ui/core/styles';
import { Badge } from '@material-ui/core';
import PropTypes from 'prop-types';
import { stripHtmlToText, dateFormat } from '../tools/functions';
import NotifierInline from './notifierInline';
import { actionGetUserAdsNext, actionGetUserAdsPrevious } from '../store/actions';

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

class AdList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: null,
            tableState: null,
            startCursor: null,
            endCursor: null,
        };
    }

    componentDidMount() {
        const { userProfile } = this.props;
        this.setState({
            ads: userProfile.ads,
            startCursor: userProfile.ads.pageInfo.startCursor,
            endCursor: userProfile.ads.pageInfo.endCursor,
        });
    }

    componentDidUpdate(prevProps) {
        const { userProfile, dataUserAds } = this.props;
        if (!prevProps.userProfile && userProfile) {
            this.setState({
                ads: userProfile.ads,
                startCursor: userProfile.ads.pageInfo.startCursor,
                endCursor: userProfile.ads.pageInfo.endCursor,
            });
        }
        if (!prevProps.dataUserAds && dataUserAds) {
            if (dataUserAds.user.ads.edges.length !== 0) {
                this.setState({
                    ads: dataUserAds.user.ads,
                    endCursor: dataUserAds.user.ads.pageInfo.endCursor,
                    startCursor: dataUserAds.user.ads.pageInfo.startCursor,
                });
            }
        }
    }

    onChangePage = (tableState) => {
        const { userProfile: { id } } = this.props;
        if (tableState.page > this.state.tableState.page) {
            this.props.actionGetUserAdsNext({
                userId: id,
                cursor: this.state.endCursor,
            });
        } else {
            this.props.actionGetUserAdsPrevious({
                userId: id,
                cursor: this.state.startCursor,
            });
        }
        this.setState({ tableState });
    };

    render() {
        const { classes, router } = this.props;
        const { ads } = this.state;
        const data = [];
        if (ads && ads.edges.length !== 0) {
            ads.edges.forEach((row) => {
                data.push({
                    id: row.node._id,
                    createdAt: row.node.createdAt,
                    category: row.node.category.title,
                    description: stripHtmlToText(row.node.description),
                    isActive: row.node.isActive,
                    bids: row.node.bids.length,
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
                name: 'isActive',
                label: 'Is published?',
                options: {
                    customBodyRender: (value) => {
                        return value ? (
                            <CheckBox className={classes.isActive} />
                        ) : (
                            <Cancel className={classes.isNotActive} />
                        );
                    },
                },
            },
            {
                name: 'editAd',
                label: ' Edit ad',
                options: {
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <EditOutlined
                                id={tableMeta.rowData[0]}
                                className={classes.clickable}
                                onClick={() => router.push(`/my-ads/edit/${tableMeta.rowData[0]}`)}
                            />
                        );
                    },
                },
            },
            {
                name: 'bids',
                label: 'Bids',
                options: {
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <Badge badgeContent={value} color="primary" showZero>
                                <GavelOutlined
                                    id={tableMeta.rowData[0]}
                                    className={classes.clickable}
                                    onClick={() => router.push(`/my-ads/bids/${tableMeta.rowData[0]}`)}
                                />
                            </Badge>
                        );
                    },
                },
            },
        ];
        const options = {
            count: (ads && ads.totalCount) || null,
            sort: false,
            search: false,
            viewColumns: false,
            filter: false,
            print: false,
            download: false,
            filterType: 'dropdown',
            responsive: 'stacked',
            selectableRows: 'none',
            selectableRowsHeader: false,
            serverSide: true,
            rowsPerPageOptions: [10],
            onTableInit: (action, tableState) => {
                this.setState({ tableState });
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                case 'changePage':
                    this.onChangePage(tableState);
                    return null;
                default:
                    return null;
                }
            },
        };

        if (ads && ads.edges.length !== 0) {
            return (
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title="My ads"
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            );
        }
        return <NotifierInline isNotClosable message="No active ads" />;
    }
}

AdList.propTypes = {
    userProfile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    actionGetUserAdsPrevious: PropTypes.func.isRequired,
    actionGetUserAdsNext: PropTypes.func.isRequired,
    dataUserAds: PropTypes.any,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.ad,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionGetUserAdsNext,
        actionGetUserAdsPrevious,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AdList)));