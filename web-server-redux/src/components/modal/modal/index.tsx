import * as React from 'react';

interface IModalProps extends React.Props<any> {
  isVisible?: boolean;
};

export default function Modal({
  isVisible = false,
  children = null
}: IModalProps) {
  const styles = {
    visibility: isVisible ? 'visible' : 'hidden',
    opacity: isVisible ? 1 : 0,
  };

  return (
    <div style={ styles }
      className="fixed top-0 bottom-0 left-0 right-0 z1 bg-darken-3 z3">
      { children }
    </div>
  );
};
