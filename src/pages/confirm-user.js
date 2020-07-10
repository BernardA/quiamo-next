import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { actionPostUserConfirm } from '../store/actions';
import { Loading } from '../components/loading';
import NotifierInline from '../components/notifierInline';
import styles from '../styles/passwordRecovery.module.scss';
import getCategories from '../lib/getCategories';


class ConfirmUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmationToken: null,
        };
    }

    componentDidMount() {
        const token = this.props.location.pathname.replace('/confirm-user/', '');
        if (token) {
            this.setState({ confirmationToken: token });
            this.props.actionPostUserConfirm(token);
        }
    }

    componentDidUpdate(prevProps) {
        const { dataConfirmation, router} = this.props;
        if (prevProps.dataConfirmation !== dataConfirmation && dataConfirmation) {
            this.timeout = setTimeout(() => router.push('/login'), 5000);
        }
    }

    render() {
        const {
            errorConfirmation, dataConfirmation, isLoading,
        } = this.props;
        const { confirmationToken } = this.state;
        return (
            <>
                <main>
                    {isLoading ? <Loading /> : null}
                    <Card id="noShadow" className={styles.root}>
                        <CardHeader
                            className={styles.header}
                            title={(
                                <Typography
                                    className={styles.title}
                                    component="h3"
                                >
                                    Email confirmation
                                </Typography>
                            )}
                        />
                        <CardContent className={styles.content}>
                            {errorConfirmation ? (
                                <NotifierInline
                                    message="Expired or invalid token"
                                    isNotClosable
                                />
                            ) : null}
                            {!confirmationToken ? (
                                <NotifierInline
                                    message="Missing information token"
                                    isNotClosable
                                />
                            ) : null}
                            {dataConfirmation ? (
                                <NotifierInline
                                    message="Registration complete. You will be redirected to login"
                                    isNotClosable
                                />
                            ) : null}
                        </CardContent>
                    </Card>
                </main>
            </>
        );
    }
}

ConfirmUser.propTypes = {
    location: PropTypes.object.isRequired,
    actionPostUserConfirm: PropTypes.func.isRequired,
    dataConfirmation: PropTypes.any,
    errorConfirmation: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        ...state.register,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostUserConfirm,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ConfirmUser));

export async function getServerSideProps() {
    let categories = await getCategories();
    categories = categories.data.categories;
    return {
        props: {
            categories,
        },
    };
}
