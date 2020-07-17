import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'next/router';
import { 
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
} from '@material-ui/core/';
import { DeleteOutlined } from '@material-ui/icons/';
import ReactCrop from 'react-image-crop';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import {
    image64toCanvasRef,
    base64StringtoFile,
    extractImageFileExtensionFromBase64,
    handleIsNotAuthenticated,
    handleCheckAuthentication,
} from '../../tools/functions';
import {
    AVATAR_ACCEPTED_MIME_TYPES,
    UPLOAD_MAX_SIZE,
    AVATAR_MAX_PIXEL_WIDTH,
} from '../../parameters';
import NotifierDialog from '../../components/notifierDialog';
import Breadcrumb from '../../components/breadcrumb';
import { actionUploadUserImage, actionGetUserProfile } from '../../store/actions';
import { Loading } from '../../components/loading';
import styles from '../../styles/login.module.scss';
import getCategories from '../../lib/getCategories';

class ImageUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.state = {
            selectedFile: null,
            selectedFileMimeType: null,
            selectedFileName: null,
            uploadErrors: [],
            // maxWidth: null,
            // minHeight: null,
            crop: {
                // width: 30,
                x: 10,
                y: 30,
                aspect: 1 / 1,
            },
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const { router, isAuth: { isAuthenticated }} = this.props;
        if (!isAuthenticated) {
            handleIsNotAuthenticated(router);
        } 
    }

    componentDidUpdate(prevProps) {
        const { errorImage, dataImage } = this.props;
        if (prevProps.errorImage !== errorImage && errorImage) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct below',
                    errors: errorImage,
                },
            });
        }
        if (prevProps.dataImage !== dataImage && dataImage) {
            this.props.actionGetUserProfile(this.props.cookies.get('userId'));
            this.handleDeleteFileSelected();
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your image is updated.',
                    errors: {},
                },
            });
        }
    }

    handleFileSelected = (event) => {
        const file = event.target.files[0];
        const errors = [];
        if (!AVATAR_ACCEPTED_MIME_TYPES.includes(file.type)) {
            errors.push('Invalid file type. Only jpeg and png accepted');
        }
        if (file.size > UPLOAD_MAX_SIZE) {
            errors.push('File size is bigger than allowed( 2MB )');
        }
        this.setState({ uploadErrors: errors });
        if (errors.length === 0) {
            const filename = file.name.split('.')[0];
            const myFileReader = new FileReader();
            myFileReader.addEventListener('load', () => {
                // get image dimensions to adjust crop area
                const img = new Image();
                img.src = myFileReader.result;
                let maxWidth;
                // let minHeight;
                img.onload = () => {
                    maxWidth = (AVATAR_MAX_PIXEL_WIDTH / img.width) * 100;
                    // minHeight =
                    // ((AVATAR_MAX_PIXEL_WIDTH / this.state.crop.aspect) / img.height) * 100;
                    this.setState({
                        selectedFile: myFileReader.result,
                        selectedFileMimeType: file.type,
                        selectedFileName: filename,
                        // maxWidth,
                        // minHeight,
                        crop: {
                            width: maxWidth,
                            x: 10,
                            y: 10,
                            aspect: 1 / 1,
                        },
                    });
                };
            },
            false);
            myFileReader.readAsDataURL(file);

            document.getElementById('selected_file').innerHTML = file.name;
            document.getElementById('file_holder').classList.remove('no_show');
            document.getElementById('file_submit').classList.remove('no_show');
            document.getElementById('file_select').classList.add('no_show');
            document.getElementById('img_crop').classList.remove('no_show');
        }
    };

    handleDeleteFileSelected = () => {
        this.setState({
            selectedFile: null,
            selectedFileMimeType: null,
            selectedFileName: null,
        });
        document.getElementById('selected_file').innerHTML = '';
        document.getElementById('file_holder').classList.add('no_show');
        document.getElementById('file_submit').classList.add('no_show');
        document.getElementById('file_select').classList.remove('no_show');
        document.getElementById('img_crop').classList.add('no_show');
    };

    handleCropChange = (crop) => {
        this.setState({ crop });
    };

    handleCropComplete = (crop, percentCrop) => {
        const canvasRef = this.imagePreviewCanvasRef.current;
        image64toCanvasRef(
            canvasRef,
            this.state.selectedFile,
            percentCrop,
            AVATAR_MAX_PIXEL_WIDTH,
        );
    };

    handleImageUploadFormSubmit = (event) => {
        event.preventDefault();
        const fileExtension = extractImageFileExtensionFromBase64(
            this.state.selectedFile,
        );
        const filename = `${this.state.selectedFileName}.${fileExtension}`;
        let croppedImage = this.imagePreviewCanvasRef.current.toDataURL(
            this.state.selectedFileMimeType,
        );
        croppedImage = base64StringtoFile(croppedImage, filename);
        const formData = new FormData();
        formData.append('file', croppedImage);
        this.props.actionUploadUserImage(formData);
    };

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (this.props.dataImage) {
            this.props.router.push('/account');
        }
    };

    render() {
        const { uploadErrors } = this.state;
        const errors = uploadErrors.map((error, index) => {
            return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                    {error}
                </li>
            );
        });
        const { isLoading, isAuth: { isAuthenticated } } = this.props;

        if (!isAuthenticated) {
            return null;
        }
        return (
            <main>
                {isLoading ? <Loading /> : null}
                <Breadcrumb links={[
                    { href: '/account', text: 'account' },
                    { href: null, text: 'upload-image' },
                ]}
                />
                <Card id="noShadow" className={styles.root}>
                    <CardHeader
                        className={styles.header}
                        title={(
                            <Typography className={styles.title} component="h3">
                                Image upload
                            </Typography>
                        )}
                    />
                    <CardContent className={styles.content}>
                        <form onSubmit={this.handleImageUploadFormSubmit}>
                            <div id="file_select">
                                <label htmlFor="imgFile" id="imgFile_label">
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        className="no_click"
                                        color="primary"
                                    >
                                        Add/change image
                                    </Button>
                                </label>
                                <input
                                    style={{ display: 'none' }}
                                    name="form[imgFile]"
                                    type="file"
                                    id="imgFile"
                                    onChange={this.handleFileSelected}
                                />
                            </div>
                            <div id="file_holder" className="no_show">
                                <div className="flex">
                                    <p id="selected_file" />
                                    <Button
                                        id="delete_file"
                                        className="icon_container"
                                        onClick={this.handleDeleteFileSelected}
                                    >
                                        <DeleteOutlined className="no_click" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <ul>{errors}</ul>
                            </div>
                            <div id="file_submit" className="no_show">
                                <Button
                                    name="form[save]"
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                >
                                    Upload
                                </Button>
                            </div>
                        </form>
                        {this.state.selectedFile ? (
                            <ReactCrop
                                src={this.state.selectedFile}
                                crop={this.state.crop}
                                onChange={this.handleCropChange}
                                onComplete={this.handleCropComplete}
                                // maxWidth={this.state.maxWidth}
                                // minHeight={this.state.minHeight}
                            />
                        ) : null}
                        <div id="img_crop">
                            <canvas ref={this.imagePreviewCanvasRef} />
                        </div>
                        <NotifierDialog
                            notification={this.state.notification}
                            handleNotificationDismiss={
                                this.handleNotificationDismiss
                            }
                        />
                    </CardContent>
                </Card>
            </main>
        );
    }
}

ImageUploadForm.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    dataImage: PropTypes.any,
    errorImage: PropTypes.any,
    actionUploadUserImage: PropTypes.func.isRequired,
    actionGetUserProfile: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    isAuth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        errorImage: state.account.errorImage,
        dataImage: state.account.dataImage,
        isLoading: state.account.isLoading,
        imageUploadForm: state.form.ImageUploadForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionUploadUserImage,
            actionGetUserProfile,
        },
        dispatch,
    );
}

// eslint-disable-next-line no-class-assign
ImageUploadForm = withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageUploadForm));

export default reduxForm({
    form: 'ImageUploadForm',
})(withRouter(ImageUploadForm));

export async function getServerSideProps(context) {
    // https://github.com/vercel/next.js/discussions/11281
    const categories = await getCategories();
    return {
        props: {
            categories: categories.data.categories,
            isAuth: handleCheckAuthentication(context),
        },
    };
}
