import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'next/router';
import { 
    Card,
    CardHeader,
    CardContent,
    Typography,
} from '@material-ui/core/';
import PropTypes from 'prop-types';
import { actionPostUserConfirm } from '../../store/actions';
import { Loading } from '../../components/loading';
import NotifierInline from '../../components/notifierInline';
import styles from '../../styles/passwordRecovery.module.scss';
import getCategories from '../../lib/getCategories';


class ConfirmUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmationToken: null,
        };
    }

    componentDidMount() {
        console.log('CONFIRM-USER', this.props);
        const token = this.props.router.query.confirmationToken;
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
                                    severity="danger"
                                    isNotClosable
                                />
                            ) : null}
                            {!confirmationToken ? (
                                <NotifierInline
                                    message="Missing information token"
                                    severity="danger"
                                    isNotClosable
                                />
                            ) : null}
                            {dataConfirmation ? (
                                <NotifierInline
                                    message="Registration complete. You will be redirected to login"
                                    severity="success"
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
    router: PropTypes.object.isRequired,
    actionPostUserConfirm: PropTypes.func.isRequired,
    dataConfirmation: PropTypes.any,
    errorConfirmation: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
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
