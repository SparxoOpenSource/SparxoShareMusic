import * as React from 'react';
import {reduxForm} from 'redux-form';

import Form from '../form/';
import FormGroup from '../form/form-group';
import FormLabel from '../form/form-label';
import FormError from '../form/form-error';
import Input from '../form/form-input';
import Button from '../button';
import Alert from '../alert';

interface ILoginFormProps {
  onSubmit: () => void;
  handleSubmit?: () => void;
  resetForm?: () => void;
  errorMessage?:string;
  isPending: boolean;
  hasError: boolean;
  fields?: {
    username: any;
    studioId: any;
  };
};

// Making this a class-based component until redux-form typings support 
// stateless functional components.
class LoginForm extends React.Component<ILoginFormProps, void> {

  render() {
    const {
      handleSubmit,
      resetForm,
      isPending,
      hasError,
      errorMessage,
      fields: {
        username,
        studioId
      }
    } = this.props;
    return (
      <Form handleSubmit={ handleSubmit }>
        <Alert isVisible={ isPending }>Loading...</Alert>
        <Alert id="qa-alert" isVisible={ hasError } status="error">
          {errorMessage||"Invalid username and password"}
        </Alert>
        <FormGroup>
          <FormLabel id="qa-uname-label">Username</FormLabel>
          <Input type="text" fieldDefinition={ username } id="qa-uname-input"/>
          <FormError id="qa-uname-validation"
            isVisible={ !!(username.touched && username.error) }>
            { username.error }
          </FormError>
        </FormGroup>
        <FormGroup>
          <FormLabel id="qa-studioId-label">Studio</FormLabel>
          <select {...studioId} value={studioId.value} id="qa-studioId-select" className="block col-12 mb1 select">
            <option value="">select a studio...</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <FormError id="qa-ustudio-validation"
            isVisible={ !!(studioId.touched && studioId.error) }>
            { studioId.error }
          </FormError>
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="mr1" id="qa-login-button">
            Login
          </Button>
          <Button onClick={ resetForm }
            type="reset"
            className="bg-red" id="qa-clear-button">
            Clear
          </Button>
        </FormGroup>
      </Form>
    );
  }

  static validate(values) {
    const errors = { username: '', studioId: '' };

    if (!values.username) {
      errors.username = 'Username is required.';
    }
    if (!values.studioId) {
      errors.studioId = 'studio is required.';
    }


    return errors;
  }
}
export default reduxForm({
  form: 'login',
  fields: [
    'username',
    'studioId',
  ],
  validate: LoginForm.validate,
})(LoginForm);
