import * as React from 'react';
import { Modal, ModalContent } from '../modal';
import LoginForm from './login-form';

interface ILoginModalProps extends React.Props<any> {
  isVisible: boolean;
  isPending: boolean;
  hasError: boolean;
  errorMessage:string;
  onSubmit: () => void;
};

export default function LoginModal({
  isVisible,
  isPending,
  hasError,
  errorMessage,
  onSubmit
}: ILoginModalProps) {
  return (
    <Modal isVisible={ isVisible }>
      <ModalContent>
        <h1 className="mt0">Login</h1>

        <LoginForm
          isPending={ isPending }
          hasError={ hasError }
          errorMessage={errorMessage}
          onSubmit={ onSubmit } />
      </ModalContent>
    </Modal>
  );
}
