import * as React from 'react';
import {connect} from 'react-redux';
import { Modal, ModalContent } from '../modal';
import {showAddModal, addMusic} from "../../actions/add";
import {reduxForm} from 'redux-form';

import Form from '../form/';
import FormGroup from '../form/form-group';
import FormLabel from '../form/form-label';
import FormError from '../form/form-error';
import Input from '../form/form-input';
import Button from '../button';
import Alert from '../alert';

interface IAddModalProps extends React.Props<any> {
    add?: any
    showAddModal?: () => void;
    onAddMusic?: () => void;
    resetForm?: () => void;
    errorMessage?: string;
    isPending?: boolean;
    hasError?: boolean;
    fields?: {
        url: any;
    };
};

function mapStateToProps(state) {
    return {
        add: state.add,
        initialValues: state.add,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        showAddModal: () => dispatch(showAddModal(false)),
        onAddMusic: () =>{
            return dispatch(addMusic())
        }
    };
}

class AddModal extends React.Component<IAddModalProps, void> {

    render() {
        var {
            add,
            showAddModal,
            onAddMusic,
            resetForm,
            fields: {
                url
            }} = this.props;
        return (
            <Modal isVisible={add.visible }>
                <ModalContent>
                    <div className="relative">
                        <h1 className="mt0">Add</h1>
                        <a href="javascript:;" style={{ display: "block", width: '20px', height: '20px', textDecoration: 'none', textAlign: 'center', lineHeight: '15px' }} className="absolute right-0 top-0 border circle" onClick={showAddModal }>&times; </a>
                    </div>
                    <Form handleSubmit={ onAddMusic }>
                        <Alert isVisible={ add.isLoading }>请稍后...</Alert>
                        <Alert id="qa-alert" isVisible={ add.hasError } status="error">
                            {add.errorMessage}
                        </Alert>
                        <FormGroup>
                            <FormLabel id="qa-url-label">Url</FormLabel>
                            <Input placeholder="请输入Soundcloud或搜狗音乐地址..."
                                type="text"
                                fieldDefinition={ url } id="qa-url-input"/>
                            <FormError id="qa-url-validation"
                                isVisible={ !!(url.touched && url.error) }>
                                { url.error }
                            </FormError>
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" className="mr1" id="qa-login-button">
                                Add
                            </Button>
                            <Button onClick={ resetForm }
                                type="reset"
                                className="bg-red" id="qa-clear-button">
                                Clear
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalContent>
            </Modal>
        );
    }

    static validate(values) {
        const errors = { url: '', studioId: '' };
        if (!values.url) {
            errors.url = 'url is required.';
        }

        if (values.url && values.url.indexOf("http://mp3.sogou.com/tiny/song") != 0) {
            if (
                values.url.indexOf("http://music.163.com")!=0&&
                values.url.indexOf('http://mp3.sogou.com/tiny/song') != 0 
            && values.url.indexOf("soundcloud.com") == -1) {
                errors.url = "不支持的url地址";
            }
        }
        return errors;
    }
}

export default reduxForm({
    form: 'add',
    fields: [
        'url'
    ],
    validate: AddModal.validate,
}, mapStateToProps, mapDispatchToProps)(AddModal)