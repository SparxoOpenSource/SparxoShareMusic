import * as React from 'react';

interface INavigatorProps extends React.Props<any> {}

export default function Navigator({ children = null }: INavigatorProps) {
  return (
    <nav className="fixed top-0 z2 left-0 right-0 flex items-center p1 bg-white border-bottom">
      { children }
    </nav>
  );
}
