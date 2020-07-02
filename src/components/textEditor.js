/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import styles from '../styles/mailbox.module.scss';

class TextEditor extends React.Component {
    componentDidMount() {
        // fixes tabindex
        const toolspans = document.querySelectorAll('div.ql-toolbar span');
        toolspans.forEach((span) => {
            // eslint-disable-next-line no-param-reassign
            span.tabIndex = -1;
        });
        const toolbuttons = document.querySelectorAll('div.ql-toolbar button');
        toolbuttons.forEach((button) => {
            // eslint-disable-next-line no-param-reassign
            button.tabIndex = -1;
        });
        const editor = document.getElementsByClassName('ql-editor');
        editor[0].tabIndex = 0;
    }

    onChange = (newValue, delta, source) => {
        const { input } = this.props;
        if (source === 'user') {
            input.onChange(newValue);
        }
    };

    onBlur = (range, source, quill) => {
        const { input } = this.props;
        input.onBlur(quill.getHTML());
    };

    render() {
        const {
            placeholder,
            input,
            meta: { touched, error, form },
        } = this.props;
        const isAdInsertForm = form === 'AdInsertForm';
        const toolbarOptions = () => {
            if (!isAdInsertForm) {
                return [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ indent: '-1' }, { indent: '+1' }],

                    ['link'],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                ];
            }
            return false;
        };
        const modules = {
            toolbar: toolbarOptions(),
            keyboard: { bindings: { tab: true } },
        };
        return (
            <>
                <ReactQuill
                    {...input}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    modules={modules}
                    placeholder={placeholder}
                    className={
                        isAdInsertForm
                            ? styles.textEditorAd
                            : styles.textEditorMessage
                    }
                />
                <span className="form_error">{touched ? error : ''}</span>
            </>
        );
    }
}

TextEditor.propTypes = {
    meta: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
};

export default TextEditor;
